/* eslint-disable */
export default class Utils {
    constructor() {
        this.changesDetected = {};
        this.is_changeing = false;
        // setInterval(()=>{
        //     let now = new Date().getTime();
        //     for(let key in this.changesDetected){
        //         let change = this.changesDetected[key];
        //         if(change.t&&now-change.t>2000){
        //             this.stoppedChanging(key);
        //         }
        //     }
        // },2000);
    }

    isFirstOrLastChange() {
        let empty = true;

        for (const key in this.changesDetected) {
            empty = false;
            break;
        }

        if (!this.is_changeing && !empty) {
            this.scene.emit('ui-changing');
            this.is_changeing = true;
        } else if (this.is_changeing && empty) {
            if (this.is_changeing) {
                this.scene.emit('ui-changing-stopped');
                this.is_changeing = false;
            }
        }
    }

    preventDefault(e) {
        if (e.detail && e.detail.preventDefault && typeof e.detail.preventDefault === 'function') {
            e.detail.preventDefault();
        }
    }

    shorten(string, length) {
        return string.length > length ? `${string.substr(0, length)}...` : string;
    }

    isChanging(scene, ref) {
        const index = this.changesDetected[ref];
        if (!index) {
            this.scene = this.scene || scene;
            const now = new Date().getTime();
            this.changesDetected[ref] = { t: now };
            this.isFirstOrLastChange();
        } else {
            this.changesDetected[ref].t = new Date().getTime();
        }
    }

    stoppedChanging(ref) {
        delete this.changesDetected[ref];
        this.isFirstOrLastChange();
    }

    copyToClipboard(text) {
        navigator.clipboard.writeText(text).then(() => {
        }, (err) => {
            console.error('copy to clipboard failed:', err);
        });
    }

    clearObject(object) {
        object.traverse((child) => {
            if (child.material) {
                if (child.material.length) {
                    for (let i = 0; i < child.material.length; i++) {
                        if (child.material[i].map) {
                            child.material[i].map.dispose();
                        }
                        child.material[i].dispose();
                    }
                } else {
                    if (child.material.map) {
                        child.material.map.dispose();
                    }
                    child.material.dispose();
                }
            }
            if (child.geometry) {
                child.geometry.dispose();
            }
        });
    }
}
