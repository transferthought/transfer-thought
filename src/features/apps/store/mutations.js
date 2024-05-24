function createMetaTag(property, value) {
    const meta = document.createElement('meta');
    meta.setAttribute('property', property);
    meta.content = value;
    document.getElementsByTagName('head')[0].appendChild(meta);
}

function hydrateAppFromDB(app) {
    const hydratedApp = { ...app };
    try {
        if (_.isString(app.config)) {
            hydratedApp.config = JSON.parse(app.config);
        }
        if (_.isString(app.actions)) {
            hydratedApp.actions = JSON.parse(app.actions);
        }
        if (_.isString(app.state)) {
            hydratedApp.state = JSON.parse(app.state);
        }
    } catch (err) {
        console.error('Error parsing app', err, app);
    }
    return hydratedApp;
}

export default {
    init(state, app) {
        state.appId = app.appId;
        state.name = app.name;
        state.thumbnail = app.thumbnailUrl;
        // duplicate here to not have to find and replace
        state.thumbnailUrl = app.thumbnailUrl;
        state.currentMonthViews = app.currentMonthViews || 0;
        state.totalViews = app.totalViews || 0;
        state.owner = app.owner;
        state.unlimted = app.unlimted;
        state.unlimtedLifetime = app.unlimtedLifetime;
        state.redirectData = app.redirectData;
        document.title = app.name;
        createMetaTag('og:title', app.name);
        createMetaTag('og:image', app.thumbnailUrl);
    },
    appOwnerData(state, appOwnerData) {
        state.ownerData = appOwnerData;
    },
    incrementAppViews(state) {
        state.currentMonthViews += 1;
        state.totalViews += 1;
        if (state.ownerData) {
            state.ownerData.totalViews += 1;
            state.ownerData.currentMonthViews += 1;
        }
    },
    fetching(state, fetching) {
        state.fetching = fetching;
    },
    setAppId(state, appId) {
        state.appId = appId;
    },
    updateName(state, newName) {
        state.name = newName;
        document.title = newName;
    },
    setRedirectData(state, redirectData) {
        state.redirectData = redirectData;
    },
    selectedEntityId(state, selectedEntityId) {
        state.selectedEntityId = selectedEntityId;
    },
    rendering(state, rendering) {
        state.rendering = rendering;
    },
    gizmoMode(state, gizmoMode) {
        state.gizmoMode = gizmoMode;
    },
    gizmoSnapTranslation(state, gizmoSnapTranslation) {
        state.gizmoSnapTranslation = gizmoSnapTranslation;
    },
    gizmoSnapRotation(state, gizmoSnapRotation) {
        state.gizmoSnapRotation = gizmoSnapRotation;
    },
    updateShowAddEntityDialog(state, showAddEntityDialog) {
        state.showAddEntityDialog = showAddEntityDialog;
    },
    isBottomPanelOpen(state, isBottomPanelOpen) {
        state.isBottomPanelOpen = isBottomPanelOpen;
    },
    publishing(state, publishing) {
        state.publishing = publishing;
    },
    saving(state, saving) {
        state.saving = saving;
    },
    scene(state, scene) {
        state.scene = scene;
    },
    snackMessage(state, message) {
        state.snack = message;
    },
    setAppList(state, appList) {
        state.appsList = _(appList)
            .orderBy('updatedAt', 'desc')
            .map((app) => {
                return hydrateAppFromDB(app);
            })
            .value();
    },
    setAppListStatus(state, appListStatus) {
        state.appsListStatus = appListStatus;
    },
};
