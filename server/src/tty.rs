use crate::Error;
use serialport::posix::TTYPort;
use std::path::PathBuf;
use std::pin::Pin;

pub struct TTY {
    pub lines: Pin<Box<dyn futures::Stream<Item = tokio::io::Result<String>> + Send>>,
}

impl TTY {
    pub async fn open(p: PathBuf) -> crate::Result<TTY> {
        let port = tokio::task::spawn_blocking(move || TTYPort::open(&p, &Default::default()))
            .await
            .map_err(|_| Error::CantOpenTTY)?
            .map_err(|_| Error::CantOpenTTY)?;
        use std::os::unix::io::{FromRawFd, IntoRawFd};
        let fd = port.into_raw_fd();
        let file = unsafe { std::fs::File::from_raw_fd(fd) };
        let tokio_file = tokio::fs::File::from_std(file);
        let (r, _w) = tokio::io::split(tokio_file);
        let buf_reader = tokio::io::BufReader::new(r);
        use tokio::io::AsyncBufReadExt;
        let lines = buf_reader.lines();
        Ok(TTY {
            lines: Box::pin(lines),
        })
    }
}
