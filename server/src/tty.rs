use crate::Error;
use futures::future;
use futures::StreamExt;
use std::path::PathBuf;
use std::pin::Pin;
use tokio::io::{AsyncBufReadExt, AsyncWriteExt};

pub struct TTY {
    pub lines: Pin<Box<dyn futures::Stream<Item = String> + Send>>,
    pub writer: Pin<Box<dyn tokio::io::AsyncWrite + Send>>,
}

impl TTY {
    pub async fn open(p: PathBuf) -> crate::Result<TTY> {
        let port = tokio_serial::Serial::from_path(p, &Default::default()).map_err(|e| {
            warn!("Error: {}", e);
            Error::CantOpenTTY
        })?;
        let (r, mut w) = tokio::io::split(port);
        let buf_reader = tokio::io::BufReader::new(r);
        let mut lines = buf_reader.lines().filter_map(|x| {
            future::ready(match x {
                Err(e) => {
                    warn!("Error: {}", e);
                    None
                }
                Ok(x) => Some(x),
            })
        });

        info!("Start handshake");

        while let Some(s) = lines.next().await {
            info!("Received {}", &s);
            if s == "started" {
                break;
            }
        }

        let handshake = format!("hi {}\n", rand::random::<u8>());
        w.write_all(handshake.as_bytes()).await.map_err(|e| {
            warn!("Error: {}", e);
            Error::CantWriteTTY
        })?;

        while let Some(s) = lines.next().await {
            info!("Received {}", &s);
            if s == handshake.trim() {
                return Ok(TTY {
                    lines: Box::pin(lines),
                    writer: Box::pin(w),
                });
            }
        }

        Err(Error::NoHandshake)
    }
}
