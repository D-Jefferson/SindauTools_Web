if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('service-worker.js')
      .then(() => console.log("SW registrado"))
      .catch(err => console.log("Erro ao registrar SW:", err));
  }