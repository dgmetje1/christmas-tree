window.onload = () => {
    const sceneEl = document.getElementById("scene");
    let currentEl = null;
    const ballElements = document.querySelectorAll("[id^=anchor]")

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

    const checkIfActivityCompleted = ()=>{
      const isActivityCompleted = Array.from({length: 6}, (_, i) => `ball-${i + 1}`).every(value => localStorage.getItem(value));
      if(isActivityCompleted){
        document.getElementById('tree').setAttribute('visible',"true");
    }else{
          document.getElementById('tree').setAttribute('visible',"false");
          ballElements.forEach(el =>{el.setAttribute('visible',false)});
        //TODO Show a toast indicating that now the tree is visible
      }
    }

    //Register events

    sceneEl.addEventListener("onefingermove", handleRotation);
    sceneEl.addEventListener("twofingermove", handleScale);

    ballElements.forEach(el =>{
        el.addEventListener("markerFound", (e) => {
            currentEl = e.currentTarget;
            const ballNumber = e.currentTarget.getAttribute("ball");
            document.getElementById("ballNumber").innerText = ballNumber;
            localStorage.setItem(`ball-${ballNumber}`, true);
            checkIfActivityCompleted();
            showToast();
        })
    });

    document.getElementById("anchor").addEventListener("markerLost", (e) => {
        currentEl = null;
    });

    checkIfActivityCompleted();
};

const showToast = () => {
    document.getElementById("foundToast").classList.add("visible");

    setTimeout(() => {
        document.getElementById("foundToast").classList.remove("visible");
    }, 5000);
};
