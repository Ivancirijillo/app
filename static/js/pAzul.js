    //pantalla completa
// const elem = document.documentElement;
// if (elem.requestFullscreen) {
//         elem.requestFullscreen();
//         } else if (elem.webkitRequestFullscreen) { /* Safari */
//         elem.webkitRequestFullscreen();
//         } else if (elem.msRequestFullscreen) { /* IE11 */
//         elem.msRequestFullscreen();
//     }

const element = document.body;

if (element.requestFullscreen) {
  element.requestFullscreen();
} else if (element.webkitRequestFullscreen) { /* Safari */
  element.webkitRequestFullscreen();
} else if (element.msRequestFullscreen) { /* IE11 */
  element.msRequestFullscreen();
}

// function toggleFullscreen() {
//         var elem = document.documentElement;
//         if (!document.fullscreenElement && !document.mozFullScreenElement) {
//           if (elem.requestFullscreen) {
//             elem.requestFullscreen();
//           } else if (elem.mozRequestFullScreen) { /* Firefox */
//             elem.mozRequestFullScreen();
//           }
//         } else {
//           if (document.exitFullscreen) {
//             document.exitFullscreen();
//           } else if (document.mozCancelFullScreen) { /* Firefox */
//             document.mozCancelFullScreen();
//           }
//         }
//     }

//     toggleFullscreen();