use futures::future;
use serialport::posix::TTYPort;
use std::path::PathBuf;
use tokio::sync::mpsc::UnboundedReceiver;
use tokio::time as timer;

use futures::prelude::*;

pub fn tty_discorver() -> UnboundedReceiver<Vec<PathBuf>> {
    let (tx, rx) = tokio::sync::mpsc::unbounded_channel();
    tokio::spawn(async move {
        let mut interval = timer::interval(timer::Duration::from_secs(1));
        let mut previous_ports: Option<Vec<PathBuf>> = None;
        while let Some(_) = interval.next().await {
            let ports = serialport::available_ports()
                .map_err(|e| warn!("Error: {}", e))
                .unwrap_or_default();
            let mut ports: Vec<_> = future::join_all(
                ports
                    .into_iter()
                    .map(|port| test_port(port.port_name.into())),
            )
            .await
            .into_iter()
            .filter_map(Result::ok)
            .collect();
            ports.sort();
            if previous_ports.as_ref() != Some(&ports) {
                tx.send(ports.clone()).unwrap();
                previous_ports = Some(ports);
            }
        }
    });

    rx
}

async fn test_port(path: PathBuf) -> Result<PathBuf, ()> {
    tokio::task::spawn_blocking(move || -> Result<PathBuf, ()> {
        TTYPort::open(&path, &Default::default()).map_err(|_| ())?;
        Ok(path)
    })
    .await
    .unwrap_or(Err(()))
}
