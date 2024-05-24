/* eslint-disable class-methods-use-this */
/* eslint-disable no-param-reassign */
/* eslint-disable no-console */

import * as _ from 'lodash';
import Scene from './Scene';

class SceneManager {
    /**
   * @description Render scene should be the entry point to render the entire scene from a json
   * config.
   * @param {sceneConfig} Object: this is the JSON config to render
   * @param {containerElement} HTMLElement: HTML Element to append scene to
   */
    async createScene(sceneConfig, initialState, containerElement) {
        const scene = new Scene(containerElement, initialState);
        this.createComponents(sceneConfig, scene, scene);
        this.createAssets(sceneConfig, scene);
        this.createCamera(sceneConfig, scene);
        this.createEntities(sceneConfig, scene, scene);
        scene.render();
        return scene;
    }
    /**
   * @description Create camera should create the camera if it is defined in the config. Otherwise
   * allow aframe to inject the default one
   * @param {sceneConfig} Object: this is the JSON config to render
   * @param {sceneElement} HTMLElement: the scene element to append the camera to
   */
    createCamera(sceneConfig, scene) {
        const cameraComponent = _.find(sceneConfig, (item) => item.type === 'component' && item.componentType === 'camera');
        if (cameraComponent) {
            const cameraEntity = sceneConfig[cameraComponent.entityId];
            const camera = scene.createNewCamera(cameraEntity);
            delete sceneConfig[cameraEntity.id];
            this.createComponents(sceneConfig, scene, camera);

            if (sceneConfig.cameraRig) {
                const cameraContainerEntity = sceneConfig.cameraRig;
                const cameraRig = scene.createNewEntity(cameraContainerEntity);
                this.createComponents(sceneConfig, scene, cameraRig);
                scene.addChild(cameraRig);
                this.createEntities(sceneConfig, scene, cameraRig);
                cameraRig.addChild(camera);
                this.createEntities(sceneConfig, scene, camera);
            } else {
                scene.el.appendChild(camera.el);
                this.createEntities(sceneConfig, scene, camera);
            }
        }
    }

    /**
   * @description Create all assets for the config
   * @param {sceneConfig} Object: this is the JSON config to render
   * @param {sceneElement} HTMLElement: the scene element to append the assets to
   */
    createAssets(sceneConfig, scene) {
        _.forOwn(sceneConfig, (item, key) => {
            if (item) {
                if (item.type === 'asset') {
                    const asset = scene.createNewAsset(item);
                    scene.addAsset(asset);
                    delete sceneConfig[key];
                } else if (item.type === 'template') {
                    const template = scene.createNewTemplate(item);
                    scene.addAsset(template);
                    this.createEntities(sceneConfig, scene, template);
                    delete sceneConfig[key];
                }
            }
        });
    }

    /**
   * @description Recursive entry point to create the entity tree
   * @param {sceneConfig} Object: this is the JSON config to render
   * @param {parentElement} HTMLElement: the parent element we are currently on
   */
    createEntities(sceneConfig, scene, parent) {
        _.forOwn(sceneConfig, (item) => {
            if (item && item.type === 'entity') {
                if (item.parent === parent.id) {
                    const entity = scene.createNewEntity(item);
                    delete [item.id];
                    parent.addChild(entity);
                    this.createComponents(sceneConfig, scene, entity);
                    this.createEntities(sceneConfig, scene, entity);
                }
            }
        });
    }

    /**
   * @description Uses the components defined in the scene config to update the element attributes
   * @param {sceneConfig} Object: this is the JSON config to render
   * @param {entityElement} HTMLElement: the element to update
   */
    createComponents(sceneConfig, scene, entity) {
        const renderTag = _.find(sceneConfig, (item) => item.entityId === entity.id && item.type === 'component' && item.componentType === 'render-tag');
        if (renderTag) {
            return;
        }
        _.forOwn(sceneConfig, (item) => {
            if (item.type === 'component' && item.entityId === entity.id) {
                const component = scene.createNewComponent(item);
                entity.addComponent(component);
                delete sceneConfig[item.id];
            }
        });
    }
}

export default new SceneManager();
