interface ConfirmationOptions {
  onOk: (() => void) | null;
  onCancel: (() => void) | null;
  title: string;
}

interface Classes {
  cancelBtn: string;
  okBtn: string;
  titleIcon: string;
}

type ConfirmationCallback = () => void;

const confirmation = (
  onOk?: ConfirmationCallback,
  onCancel?: ConfirmationCallback,
  title?: string,
  classes: Classes = {
    cancelBtn: 'tf-confirm-box-btn tf-confirm-box-btn-cancel',
    okBtn: 'tf-confirm-box-btn tf-confirm-box-btn-ok',
    titleIcon: 'tf-confirm-box-icon'
  },
  okButtonText: string = 'OK',
  cancelButtonText: string = 'Cancel'
): void => {

  const options: ConfirmationOptions = {
    onOk: onOk ?? null,
    onCancel: onCancel ?? null,
    title: title ?? 'Are you sure?'
  };

  const render = (): void => {
    const confirmBox = document.createElement('div');
    confirmBox.setAttribute('id', 'confirmBox');
    confirmBox.setAttribute('class', 'tf-confirm-box');
    document.body.prepend(confirmBox);

    confirmBox.insertAdjacentHTML(
      'beforeend',
      `<div class="tf-confirm-box__content" data-cy="modal-box-content">
        <div>
          <p class="tf-confirm-box__title">
            <span class="${classes.titleIcon}"></span>
            Confirm action:
          </p>
        </div>
        <div>
          <p class="tf-confirm-box__message">${title ?? options.title}</p>
        </div>
        <div class="tf-confirm-box__actions">
          <button
            id="cancelBtn"
            class="${classes.cancelBtn}"
            data-test="cancel_btn"
            data-cy="modal-cancel">${cancelButtonText}</button>
          <button
            id="okBtn"
            class="${classes.okBtn}"
            data-test="confirm_btn"
            data-cy="modal-confirm">${okButtonText}</button>
        </div>
      </div>`
    );

    confirmBox.classList.add('open');

    const okBtn = confirmBox.querySelector('#okBtn') as HTMLButtonElement;
    const cancelBtn = confirmBox.querySelector('#cancelBtn') as HTMLButtonElement;

    cancelBtn.focus();

    const ok = (): void => {
      okBtn.removeEventListener('click', ok);
      document.body.removeChild(confirmBox);

      if (options.onOk) {
        options.onOk();
      }
    };

    const cancel = (): void => {
      cancelBtn.removeEventListener('click', cancel);
      document.body.removeChild(confirmBox);

      if (options.onCancel) {
        options.onCancel();
      }
    };

    okBtn.addEventListener('click', ok);
    cancelBtn.addEventListener('click', cancel);
  };

  render();
};

export default confirmation;
