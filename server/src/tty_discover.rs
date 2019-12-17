use futures::future;
use serialport::posix::TTYPort;
use std::path::PathBuf;
use std::convert::Infallible;

pub async fn tty_discover() -> Result<impl warp::Reply, Infallible> {
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
    Ok(warp::reply::json(&ports))
}

async fn test_port(path: PathBuf) -> Result<PathBuf, ()> {
    tokio::task::spawn_blocking(move || -> Result<PathBuf, ()> {
        TTYPort::open(&path, &Default::default()).map_err(|_| ())?;
        Ok(path)
    })
    .await
    .unwrap_or(Err(()))
}
