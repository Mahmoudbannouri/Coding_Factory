import swal from 'sweetalert2';


//-------------- Basic --------------


// Simple Alert
export function BasicAlert() {
  swal.fire({
    title: 'Any fool can use a computer',
    customClass: {
      confirmButton: 'btn btn-primary'
    },
    buttonsStyling: false
  });
}

// Alert with Title
export function WithTitle() {
  swal.fire({
    title: 'The Internet?',
    text: "That thing is still around?",
    customClass: {
      confirmButton: 'btn btn-primary'
    },
    buttonsStyling: false,
  });
}

// Alert with footer
export function WithFooter() {
  swal.fire({
    icon: 'error',
    title: 'Oops...',
    text: 'Something went wrong!',
    footer: '<a href = "javascript:void(0);">Why do I have this issue?</a>',
    customClass: {
      confirmButton: 'btn btn-primary'
    },
    buttonsStyling: false
  });
}

//  HTML Alert
export function HtmlAlert() {
  swal.fire({
    title: '<strong>HTML <u>example</u></strong>',
    icon: 'info',
    html: 'You can use <b>bold text</b>, ' +
      '<a href="https://pixinvent.com/" target="_blank">links</a> ' +
      'and other HTML tags',
    showCloseButton: true,
    showCancelButton: true,
    focusConfirm: false,
    confirmButtonText: '<i class="fa fa-thumbs-o-up"></i> Great!',
    confirmButtonAriaLabel: 'Thumbs up, great!',
    cancelButtonText: '<i class="fa fa-thumbs-o-down"></i>',
    cancelButtonAriaLabel: 'Thumbs down',
    buttonsStyling: false,
    customClass: {
      confirmButton: 'btn btn-primary',
      cancelButton: 'btn btn-danger ml-1'
    },
  });
}

//-------------- Position --------------

// Top-start
export function PositionTopStart() {
  swal.fire({
    position: 'top-start',
    icon: 'success',
    title: 'Your work has been saved',
    showConfirmButton: false,
    timer: 1500,
    customClass: {
      confirmButton: 'btn btn-primary'
    },
    buttonsStyling: false,
  });
}

// Top-end
export function PositionTopEnd() {
  swal.fire({
    position: 'top-end',
    icon: 'success',
    title: 'Your work has been saved',
    showConfirmButton: false,
    timer: 1500,
    customClass: {
      confirmButton: 'btn btn-primary'
    },
    buttonsStyling: false,
  });
}

// Bottom-start
export function PositionBottomStart() {
  swal.fire({
    position: 'bottom-start',
    icon: 'success',
    title: 'Your work has been saved',
    showConfirmButton: false,
    timer: 1500,
    customClass: {
      confirmButton: 'btn btn-primary'
    },
    buttonsStyling: false,
  });
}

// Bottom-end
export function PositionBottomEnd() {
  swal.fire({
    position: 'bottom-end',
    icon: 'success',
    title: 'Your work has been saved',
    showConfirmButton: false,
    timer: 1500,
    customClass: {
      confirmButton: 'btn btn-primary'
    },
    buttonsStyling: false,
  });
}


//-------------- Animations --------------

// Bounce-in
export function BounceInAnimation() {
  swal.fire({
    title: 'Bounce In Animation',
    showClass: {
      popup: 'animated bounceIn'
    },
    customClass: {
      confirmButton: 'btn btn-primary'
    },
    buttonsStyling: false,
  });
}

// Fade-in
export function FadeInAnimation() {
  swal.fire({
    title: 'Fade In Animation',
    showClass: {
      popup: 'animated fadeIn'
    },
    customClass: {
      confirmButton: 'btn btn-primary'
    },
    buttonsStyling: false
  });
}

// Flip-in
export function FlipXAnimation() {
  swal.fire({
    title: 'Flip In Animation',
    showClass: {
      popup: 'animated flipInX'
    },
    customClass: {
      confirmButton: 'btn btn-primary'
    },
    buttonsStyling: false,
  });
}

// Tada
export function TadaAnimation() {
  swal.fire({
    title: 'Tada Animation',
    showClass: {
      popup: 'animated tada'
    },
    customClass: {
      confirmButton: 'btn btn-primary'
    },
    buttonsStyling: false,
  });
}

// Shake
export function ShakeAnimation() {
  swal.fire({
    title: 'Shake Animation',
    showClass: {
      popup: 'animated shake'
    },
    customClass: {
      confirmButton: 'btn btn-primary'
    },
    buttonsStyling: false,
  });
}

//-------------- Types --------------

// Success
export function TypeSuccess() {
  swal.fire({
    title: "Good job!",
    text: "You clicked the button!",
    icon: "success",
    customClass: {
      confirmButton: 'btn btn-primary'
    },
    buttonsStyling: false,
  });
}

// Info
export function TypeInfo() {
  swal.fire({
    title: "Info!",
    text: "You clicked the button!",
    icon: "info",
    customClass: {
      confirmButton: 'btn btn-primary'
    },
    buttonsStyling: false,
  });
}

// Warning
export function TypeWarning() {
  swal.fire({
    title: "Warning!",
    text: "You clicked the button!",
    icon: "warning",
    customClass: {
      confirmButton: 'btn btn-primary'
    },
    buttonsStyling: false,
  });
}

// Error
export function TypeError() {
  swal.fire({
    title: "Error!",
    text: "You clicked the button!",
    icon: "error",
    customClass: {
      confirmButton: 'btn btn-primary'
    },
    buttonsStyling: false,
  });
}

//-------------- Options --------------

// Custom Icon
export function CustomIcon() {
  swal.fire({
    title: 'Sweet!',
    text: 'Modal with a custom image.',
    imageUrl: 'assets/img/gallery/13.jpg',
    imageWidth: 400,
    imageHeight: 200,
    imageAlt: 'Custom image',
    animation: false,
    customClass: {
      confirmButton: 'btn btn-primary'
    },
    buttonsStyling: false,
  });
}

// Auto close
export function AutoClose() {
  let timerInterval
  swal.fire({
    title: 'Auto close alert!',
    html: 'I will close in <b></b> milliseconds.',
    timer: 2000,
    timerProgressBar: true,
    customClass: {
      confirmButton: 'btn btn-primary'
    },
    buttonsStyling: false,
    onBeforeOpen: () => {
      swal.showLoading()
      timerInterval = setInterval(() => {
        const content = swal.getContent()
        if (content) {
          const b = content.querySelector('b')
          if (b) {
            b.textContent = swal.getTimerLeft().toString()
          }
        }
      }, 100)
    },
    onClose: () => {
      clearInterval(timerInterval)
    }
  }).then((result) => {
    /* Read more about handling dismissals below */
    if (result.dismiss === swal.DismissReason.timer) {
      console.log('I was closed by the timer')
    }
  })
}

// Allow Outside Click
export function OutsideClick() {
  swal.fire({
    title: 'Outside click is disabled!',
    text: 'This is a cool message!',
    allowOutsideClick: false,
    customClass: {
      confirmButton: 'btn btn-primary'
    },
    buttonsStyling: false,
  });
}

// Prompt Function
export function PromptFunction() {
  swal.mixin({
    input: 'text',
    confirmButtonText: 'Next &rarr;',
    showCancelButton: true,
    progressSteps: ['1', '2', '3'],
    customClass: {
      confirmButton: 'btn btn-primary',
      cancelButton: 'btn btn-danger ml-1'
    },
    buttonsStyling: false,
  }).queue([{
    title: 'Question 1',
    text: 'Chaining swal2 modals is easy'
  },
    'Question 2',
    'Question 3'
  ]).then(function (result: any) {
    if (result.value) {
      swal.fire({
        title: 'All done!',
        html: 'Your answers: <pre><code>' +
          JSON.stringify(result.value) +
          '</code></pre>',
        confirmButtonText: 'Lovely!'
      })
    }
  });
}

// Ajax Request
export function AjaxRequest() {
  swal.fire({
    title: 'Submit your Github username',
    input: 'text',
    inputAttributes: {
      autocapitalize: 'off'
    },
    buttonsStyling: false,
    showCancelButton: true,
    confirmButtonText: 'Look up',
    showLoaderOnConfirm: true,
    customClass: {
      confirmButton: 'btn btn-primary',
      cancelButton: 'btn btn-danger ml-1'
    },
    preConfirm: (login) => {
      return fetch(`//api.github.com/users/${login}`)
        .then(response => {
          if (!response.ok) {
            throw new Error(response.statusText)
          }
          return response.json()
        })
        .catch(error => {
          swal.showValidationMessage(
            `Request failed: ${error}`
          )
        })
    },
    allowOutsideClick: () => !swal.isLoading()
  }).then((result) => {
    if (result.value) {
      swal.fire({
        title: `${result.value.login}'s avatar`,
        imageUrl: result.value.avatar_url
      })
    }
  })
}

//-------------- Confirm-options --------------


// Confirm Text
export function ConfirmText() {
  swal.fire({
    title: 'Are you sure?',
    text: "You won't be able to revert this!",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#2F8BE6',
    cancelButtonColor: '#F55252',
    confirmButtonText: 'Your text here!',
    customClass: {
      confirmButton: 'btn btn-primary',
      cancelButton: 'btn btn-danger ml-1'
    },
    buttonsStyling: false,
  }).then(function (result) {
    if (result.value) {
      swal.fire({
        icon: "success",
        title: 'Deleted!',
        text: 'Your file has been deleted.',
        customClass: {
          confirmButton: 'btn btn-success'
        },
      })
    }
  });
}

// Confirm Color
export function ConfirmColor() {
  swal.fire({
    title: 'Are you sure?',
    text: "You won't be able to revert this!",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#2F8BE6',
    cancelButtonColor: '#F55252',
    confirmButtonText: 'Yes, delete it!',
    customClass: {
      confirmButton: 'btn btn-warning',
      cancelButton: 'btn btn-danger ml-1'
    },
    buttonsStyling: false,
  }).then(function (result) {
    if (result.value) {
      swal.fire({
        icon: "success",
        title: 'Deleted!',
        text: 'Your imaginary file has been deleted.',
        customClass: {
          confirmButton: 'btn btn-success'
        },
      })
    } else if (result.dismiss === swal.DismissReason.cancel) {
      swal.fire({
        title: 'Cancelled',
        text: 'Your imaginary file is safe :)',
        icon: 'error',
        customClass: {
          confirmButton: 'btn btn-success'
        },
      })
    }
  });
}





