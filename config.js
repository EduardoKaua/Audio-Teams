microsoftTeams.app.initialize().then(() => {
  const contentUrl = "https://eduardokaua.github.io/Audio-Teams/index.html";

  microsoftTeams.pages.config.registerOnSaveHandler((saveEvent) => {
    microsoftTeams.pages.config.setConfig({
      entityId: "audioTab",
      contentUrl,
      websiteUrl: contentUrl,
      suggestedDisplayName: "Enviar Áudio",
    });
    saveEvent.notifySuccess();
  });

  microsoftTeams.pages.config.setValidityState(true);
});
