window.onload = () => {
    const reactVersion = "react-v16.4";
    const sceneEl = document.getElementById("scene");
    let currentEl = null;
    const ballElements = document.querySelectorAll("[id^=anchor]");
    const treeEl = document.getElementById("tree");

    //Methods

    const handleRotation = (e) => {
        if (currentEl) {
            currentEl.object3D.rotation.y += e.detail.positionChange.x * rotationFactor;

            currentEl.object3D.rotation.x += e.detail.positionChange.y * rotationFactor;
        }
    };
    const handleScale = (e) => {
        if (currentEl) {
            this.scaleFactor *= 1 + e.detail.spreadChange / e.detail.startSpread;

            this.scaleFactor = Math.min(Math.max(this.scaleFactor, this.data.minScale), this.data.maxScale);

            currentEl.object3D.scale.x = scaleFactor * initialScale.x;
            currentEl.object3D.scale.y = scaleFactor * initialScale.y;
            currentEl.object3D.scale.z = scaleFactor * initialScale.z;
        }
    };

    const checkIfActivityCompleted = () => {
        const NUMBER_OF_BALLS = 9;
        const ballsFound = Array.from({ length: NUMBER_OF_BALLS }, (_, i) => `ball-${i + 1}`).filter((value) => localStorage.getItem(value));
        const remainingBalls = NUMBER_OF_BALLS - ballsFound.length;
        document.getElementById("remainingNumber").innerText = remainingBalls;
        if (remainingBalls !== 0) localStorage.removeItem("version");
        return remainingBalls === 0;
    };

    const treeMarkerFoundHandler = (e) => {
        showErrorToast();
    };

    const antiCheatingHandler = (e) => {
        alert("Don't try to cheat...Now you have to restart again!");
        treeEl.innerHTML = "";
        localStorage.clear();
        checkIfActivityCompleted();
        treeEl.addEventListener("markerFound", treeMarkerFoundHandler);
        treeEl.removeEventListener("markerFound", antiCheatingHandler);
    };

    //Register events

    sceneEl.addEventListener("onefingermove", handleRotation);
    sceneEl.addEventListener("twofingermove", handleScale);
    treeEl.addEventListener("markerFound", treeMarkerFoundHandler);

    const unhideTree = () => {
        setTimeout(() => {
            document.getElementById("foundToast").classList.remove("visible");
            document.getElementById("foundedToast").classList.add("visible");
        }, 500);

        if (localStorage.getItem("version") === reactVersion) {
            treeEl.removeEventListener("markerFound", treeMarkerFoundHandler);
            treeEl.addEventListener("markerFound", (e) => {
                document.getElementById("foundedToast").classList.remove("visible");
                document.getElementById("foundTreeToast").classList.add("visible");
            });
            treeEl.innerHTML = `<a-entity
                position="0 0 0"
                scale="2 2 2"
                rotation="0 0 0"
                gltf-model="assets/christmas_tree.gltf"
                class="clickable"
                gesture-handler
                ></a-entity>`;
        } else {
            treeEl.removeEventListener("markerFound", treeMarkerFoundHandler);
            treeEl.addEventListener("markerFound", antiCheatingHandler);
        }
    };

    const includeVerification = () => {
        localStorage.setItem("version", reactVersion);
    };

    ballElements.forEach((el) => {
        el.addEventListener("markerFound", (e) => {
            currentEl = e.currentTarget;
            const ballNumber = e.currentTarget.getAttribute("ball");
            if (!localStorage.getItem(`ball-${ballNumber}`)) {
                document.getElementById("ballNumber").innerText = ballNumber;
                localStorage.setItem(`ball-${ballNumber}`, true);
                showFoundToast();

                const isActivityCompleted = checkIfActivityCompleted();
                if (isActivityCompleted) {
                    includeVerification();
                    unhideTree();
                }
            }
        });
        el.addEventListener("markerLost", (e) => {
            currentEl = null;
        });
    });

    //Initial checking
    const isActivityCompleted = checkIfActivityCompleted();
    if (isActivityCompleted) {
        window.addEventListener("arjs-video-loaded", () => {
            unhideTree();
        });
    }
};

//Aux functions
const showFoundToast = () => {
    document.getElementById("foundToast").classList.add("visible");

    setTimeout(() => {
        document.getElementById("foundToast").classList.remove("visible");
    }, 5000);
};

const showErrorToast = () => {
    document.getElementById("errorToast").classList.add("visible");

    setTimeout(() => {
        document.getElementById("errorToast").classList.remove("visible");
    }, 5000);
};
