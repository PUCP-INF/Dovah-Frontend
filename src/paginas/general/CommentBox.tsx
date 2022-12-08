import React from "react";
import {useAuth} from "../../componentes/Context";
import {useStompClient, useSubscription} from "react-stomp-hooks";
import axios from "axios";
import {Avatar, Box, Card, CardContent, CardHeader, Link} from "@mui/material";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import dayjs from "dayjs";
import Stack from "@mui/material/Stack";
import AttachmentIcon from '@mui/icons-material/Attachment';
import LoadingButton from "@mui/lab/LoadingButton";
import AttachFileIcon from '@mui/icons-material/AttachFile';
import AddCommentIcon from '@mui/icons-material/AddComment';
import type {Comentario, Hilo} from "./DovahTypes";
import {subirDocumento} from "./utils";

const CommentBox = (
    {hiloUUID, enableDocs, callback}: {hiloUUID: string, enableDocs: boolean, callback?: Function}): JSX.Element=> {
    const {user} = useAuth();
    const [hilo, setHilo] = React.useState<Hilo | null>(null);
    const [comentario, setComentario] = React.useState({
        idUsuario: user["idUsuario"],
        mensaje: ""
    });
    const [loading, setLoading] = React.useState(false);

    useSubscription((hiloUUID === "") ? []: [`/topic/chat/${hiloUUID}`, `/topic/chat/doc/${hiloUUID}`], message => {
        let comentarios: Array<Comentario> = [];
        if (hilo != null) {
            comentarios = hilo.comentarios;
        }
        const newComm = [JSON.parse(message.body), ...comentarios]
        const newHilo = {...hilo} as Hilo;
        newHilo.comentarios = newComm;
        setHilo(newHilo);
        setLoading(false);
        if (callback != null) callback();
    });
    const stompClient = useStompClient();

    const enviarComentario = () => {
        if (comentario.mensaje === "") return;
        if (stompClient) {
            stompClient.publish({
                destination: `/chat/${hiloUUID}`,
                body: JSON.stringify(comentario)
            });
            setComentario({...comentario, mensaje: ""});
        } else {
            console.log("No se pudo enviar el mensaje");
        }
    }

    const enviarDocumento = async (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.currentTarget.files == null) return;
        setLoading(true);
        const doc = await subirDocumento(event.currentTarget.files[0]);
        const json = {
            idUsuario: user["idUsuario"],
            idDocumento: doc.id
        };
        if (stompClient) {
            stompClient.publish({
                destination: `/chat/doc/${hiloUUID}`,
                body: JSON.stringify(json)
            });
        } else {
            console.log("No se pudo enviar el documento");
        }
    }

    React.useEffect(() => {
        if (hiloUUID === "") return;

        axios.get(`/hilo/${hiloUUID}`)
            .then(response => setHilo(response.data))
            .catch(() => console.log("No se encontro hilo con uuid" + hiloUUID));

    }, [hiloUUID]);

    if (hiloUUID === "") return <></>;

    if (hilo == null) return <></>;

    return (
        <Box sx={{ display: "grid", gap: 1, marginBottom: 2, gridAutoColumns: "1fr"}}>
            <TextField
                sx={{ gridColumn: '1', gridRow: 1 }}
                multiline
                rows={5}
                fullWidth
                size={"small"}
                label={"Mensaje"}
                value={comentario.mensaje}
                onChange={e => setComentario({...comentario, mensaje: e.target.value})}
            />
            <Stack sx={{ gridColumn: '1', gridRow: 2}} spacing={2} direction="row">
                {enableDocs && (
                    <LoadingButton
                        startIcon={<AttachFileIcon/>}
                        loading={loading}
                        loadingPosition="start"
                        variant="text"
                        component="label"
                    >
                        Agregar Documento
                        <input onChange={enviarDocumento} hidden accept="*/*" type="file"/>
                    </LoadingButton>
                )}
                <Button startIcon={<AddCommentIcon/>} onClick={enviarComentario}>Agregar Mensaje</Button>
            </Stack>

            {hilo.comentarios.map((e, index) => {
                const dt = dayjs.utc(e["fechaCreacion"]).local();
                const nombre = e["usuario"]["nombre"] + " " + e["usuario"]["apellido"];
                return (
                    <Card sx={{
                        gridColumn: '1',
                        gridRow: 2 + index + 1,
                        wordWrap: "break-word",
                        wordBreak: "break-word",
                        maxWidth: "100%",
                        overflow: "auto"
                    }} key={e["id"]}>
                        <CardHeader
                            disableTypography={true}
                            avatar={
                                <Avatar alt={nombre} src={e["usuario"]["picture"]}/>
                            }
                            title={<Typography sx={{ fontSize: 14 }} color="text.primary">
                                {nombre}
                            </Typography>}
                            subheader={<Typography sx={{ fontSize: 10 }} color="text.secondary">
                                {dt.format("DD-MM-YYYY HH:mm:ss")}
                            </Typography>}
                            sx={{paddingBottom: 0}}
                        />
                        <CardContent>
                            <Typography variant="body2">
                                {e["mensaje"]}
                            </Typography>
                            {e["documento"] != null && (
                                <Typography>
                                    <Link href={e.documento.url} target="_blank" display="flex" alignItems="center" flexWrap="wrap">
                                        <AttachmentIcon/> {e.documento.nombre}
                                    </Link>
                                </Typography>
                            )}
                        </CardContent>
                    </Card>
                )
            })}
        </Box>
    )
}

export default CommentBox;