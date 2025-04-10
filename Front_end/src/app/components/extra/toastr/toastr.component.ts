import { Component } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-toastr',
  templateUrl: './toastr.component.html',
  styleUrls: ['./toastr.component.scss']
})

export class ToastrComponent {
  constructor(public toastr: ToastrService) { }

  currentToast = null;

  RemoveToastr() {
    this.toastr.clear();
  }

  // Success Type
  TypeSuccess() {
    this.toastr.success('Have fun storming the castle!', 'Miracle Max Says');
  }

  // Info Type
  TypeInfo() {
    this.toastr.info('We do have the Kapua suite available.', 'Turtle Bay Resort');
  }

  // Warning Type
  TypeWarning() {
    this.toastr.warning('My name is Inigo Montoya. You killed my father, prepare to die!');
  }

  // Error Type
  TypeError() {
    this.toastr.error('I do not think that word means what you think it means.', 'Inconceivable!');
  }

  // Position Top Left
  PositionTopLeft() {
    this.RemoveToastr();
    this.toastr.info('I do not think that word means what you think it means.', 'Top Left!', {
      positionClass: 'toast-top-left',
    });
  }

  // Position Top Center
  PositionTopCenter() {
    this.RemoveToastr();
    this.toastr.info('I do not think that word means what you think it means.', 'Top Center!', {
      positionClass: 'toast-top-center'
    });
  }

  // Position Top Left
  PositionTopRight() {
    this.RemoveToastr();
    this.toastr.info('I do not think that word means what you think it means.', 'Top Right!', {
      positionClass: 'toast-top-right'
    });
  }

  // Position Top Full Width
  PositionTopFullWidth() {
    this.RemoveToastr();
    this.toastr.info('I do not think that word means what you think it means.', 'Top Full Width!', {
      positionClass: 'toast-top-full-width'
    });
  }

  // Position Botton Left
  PositionBottonLeft() {
    this.RemoveToastr();
    this.toastr.info('I do not think that word means what you think it means.', 'Botton Left!', {
      positionClass: 'toast-bottom-left'
    });
  }

  // Position Botton Center
  PositionBottonCenter() {
    this.RemoveToastr();
    this.toastr.info('I do not think that word means what you think it means.', 'Botton Center!', {
      positionClass: 'toast-bottom-center'
    });
  }

  // Position Botton Left
  PositionBottonRight() {
    this.RemoveToastr();
    this.toastr.info('I do not think that word means what you think it means.', 'Botton Right!', {
      positionClass: 'toast-bottom-right'
    });
  }

  // Position Botton Full Width
  PositionBottonFullWidth() {
    this.RemoveToastr();
    this.toastr.info('I do not think that word means what you think it means.', 'Botton Full Width!', {
      positionClass: 'toast-bottom-full-width'
    });
  }

  // Text Notification
  TextNotification() {
    this.toastr.info('Have fun storming the castle!', 'Miracle Max Says');
  }

  // close button
  CloseButton() {
    this.toastr.info('Have fun storming the castle!', 'With Close Button', { closeButton: true });
  }

  //Progress bar
  ProgressBar() {
    this.toastr.info('Have fun storming the castle!', 'Progress Bar', { "progressBar": true });
  }

  // Clear Toast Button
  ClearToastButton() {
    this.toastr.error('Clear itself?<br /><br /><button type="button" class="btn btn-secondary clear">Yes</button>', 'Clear Toast Button', {
      enableHtml: true
    });
  }

  // Immediately remove current toasts without using animation
  ShowRemoveToast() {
    this.currentToast = this.toastr.info('Have fun storming the castle!', 'Miracle Max Says');
  }
  RemoveToast() {
    this.toastr.remove(this.currentToast ? this.currentToast.toastId : null);
  }

  // Remove current toasts using animation
  ShowClearToast() {
    this.currentToast = this.toastr.info('Have fun storming the castle!', 'Miracle Max Says');
  }
  ClearToast() {
    this.toastr.clear(this.currentToast ? this.currentToast.toastId : null);
  }

  // Fast Duration
  FastDuration() {
    this.toastr.success('Have fun storming the castle!', 'Fast Duration', {
      "easeTime": 500
    });
  }

  // Timeout
  Timeout() {
    this.toastr.success('I do not think that word means what you think it means.', 'Timeout!', {
      "timeOut": 5000
    });
  }

  // Sticky
  Sticky() {
    this.toastr.info('I do not think that word means what you think it means.', 'Sticky!', {
      "timeOut": 0
    });
  }


}
