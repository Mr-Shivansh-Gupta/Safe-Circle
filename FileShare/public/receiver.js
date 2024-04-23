const form = document.querySelector("form");
const fileInput = document.querySelector(".file-input");
const progressArea = document.querySelector(".progress-area");
const uploadedArea = document.querySelector(".uploaded-area");
  var glob;
  var glob2;
  var glob_name;
  var glob_fs;
  var glob_fss;
  var m = {};


(function () {
    let senderID;
    const socket=io();
    function generateID() {
        return `${Math.trunc(Math.random() * 999)} -${Math.trunc(Math.random() * 999)} -${Math.trunc(Math.random() * 999)}`;
    }
    document.querySelector("#receiver-start-con-btn").addEventListener("click", function () {
        senderID = document.querySelector("#join-id").value;
        if (senderID.length == 0) {
            return;
        }
        let joinID = generateID();
        socket.emit("receiver-join", {
            uid: joinID,
            sender_uid: senderID
        });
        document.querySelector(".join-screen").classList.remove("active");
        document.querySelector(".fs-screen").classList.add("active");
    });

    let fileShare = {};
    socket.on("fs-meta", function (metadata) {
        fileShare.metadata = metadata;
        fileShare.transmitted = 0;
        fileShare.buffer = [];
        let filename = metadata.filename;
        console.log(metadata.filename);
        let el = document.createElement("div");
        //el.classList.add("item");
        el.innerHTML = `
        <li class="row ">
        <i class="fas fa-file-alt"></i>
        <div class="content">
          <div class="details" >
            <div class="filename">${filename} • Uploading</div>
            <div class="progress" id="source"></div>
          </div>
          <div class='progress-bar' id = 'pn'>
          
          </div>
        </div>
        </li>
      `;
        document.querySelector(".progress-area").appendChild(el);

        fileShare.progress_node = el.querySelector(".progress");

        socket.emit("fs-start", {
            uid: senderID
        });
    });

    socket.on("fs-share", function (buffer) {
        fileShare.buffer.push(buffer);
        fileShare.transmitted += buffer.byteLength;
        fileShare.progress_node.innerText = Math.trunc(fileShare.transmitted / fileShare.metadata.total_buffer_size * 100) + "%";
        glob = Math.trunc(fileShare.transmitted / fileShare.metadata.total_buffer_size * 100);
        document.getElementById('pn').innerHTML =  "<div class='progress' style='width:"+glob+"%'></div>";

        if (fileShare.transmitted == fileShare.metadata.total_buffer_size){
            download(new Blob(fileShare.buffer), fileShare.metadata.filename);
            fileShare = {};
        }
        else {
            socket.emit("fs-start", {
                uid: senderID
            });
        }

    });

})();