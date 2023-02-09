
export class Viewer{

    static showTasks(allButton, activeButton, completedButton, ul, store) {
        ul.innerHTML = '';

        store.forEach((value) =>{
            if (allButton.checked) {
                ul.appendChild(value.html);
            } else if (activeButton.checked && value.status === false) {
                ul.appendChild(value.html);
            } else if (completedButton.checked && value.status === true) {
                ul.appendChild(value.html);
            }
        });
    }

    static updateCounter(counterLabel, store) {
        let counter = 0;
        store.forEach(task => {
            if (task.status === false) {
                counter++;
            }
        })
        counterLabel.textContent = counter.toString() + ' items left';
    }

    static changeAuthStatusLogIn(userName){
        const auth_btn = document.getElementById('modal_button');
        const registry_btn = document.getElementById('register_button');
        const logout_btn = document.getElementById('logout_button');

        auth_btn.style.position = 'absolute';
        auth_btn.style.visibility = 'hidden';
        registry_btn.style.position = 'absolute';
        registry_btn.style.visibility = 'hidden';
        logout_btn.style.visibility = 'visible';
        logout_btn.style.position = 'absolute';

        document.getElementById('owner_name').textContent = userName + ' todo\'s';
    }

    static changeAuthStatusLogOut(){
        const auth_btn = document.getElementById('modal_button');
        const registry_btn = document.getElementById('register_button');
        const logout_btn = document.getElementById('logout_button');

        logout_btn.style.visibility = 'hidden';
        logout_btn.style.position = 'static';
        registry_btn.style.position = 'static';
        registry_btn.style.visibility = 'visible';
        auth_btn.style.position = 'static';
        auth_btn.style.visibility = 'visible';

        document.getElementById('owner_name').textContent = 'Common todo\'s';
    }
}

(function () {
    if (typeof window.CustomEvent === "function") return false;
    function CustomEvent(event, params) {
        params = params || { bubbles: false, cancelable: false, detail: null };
        var evt = document.createEvent('CustomEvent');
        evt.initCustomEvent(event, params.bubbles, params.cancelable, params.detail);
        return evt;
    }
    window.CustomEvent = CustomEvent;
})();

const modal = function (options) {
    var
        _elemModal,
        _eventShowModal,
        _eventHideModal,
        _hiding = false,
        _destroyed = false,
        _animationSpeed = 200;

    function _createModal(options) {
        var
            elemModal = document.createElement('div'),
            modalTemplate = '<div class="modal__backdrop" data-dismiss="modal"><div class="modal__content"><div class="modal__header"><div class="modal__title" data-modal="title">{{title}}</div><span class="modal__btn-close" data-dismiss="modal" title="Закрыть">×</span></div><div class="modal__body" data-modal="content">{{content}}</div>{{footer}}</div></div>',
            modalFooterTemplate = '<div class="modal__footer">{{buttons}}</div>',
            modalButtonTemplate = '<button type="button" class="{{button_class}}" data-handler={{button_handler}}>{{button_text}}</button>',
            modalHTML,
            modalFooterHTML = '';

        elemModal.classList.add('modal');
        modalHTML = modalTemplate.replace('{{title}}', options.title || 'Новое окно');
        modalHTML = modalHTML.replace('{{content}}', options.content || '');
        if (options.footerButtons) {
            for (var i = 0, length = options.footerButtons.length; i < length; i++) {
                var modalFooterButton = modalButtonTemplate.replace('{{button_class}}', options.footerButtons[i].class);
                modalFooterButton = modalFooterButton.replace('{{button_handler}}', options.footerButtons[i].handler);
                modalFooterButton = modalFooterButton.replace('{{button_text}}', options.footerButtons[i].text);
                modalFooterHTML += modalFooterButton;
            }
            modalFooterHTML = modalFooterTemplate.replace('{{buttons}}', modalFooterHTML);
        }
        modalHTML = modalHTML.replace('{{footer}}', modalFooterHTML);
        elemModal.innerHTML = modalHTML;
        document.body.appendChild(elemModal);
        return elemModal;
    }

    function _showModal() {
        if (!_destroyed && !_hiding) {
            _elemModal.classList.add('modal__show');
            document.dispatchEvent(_eventShowModal);
        }
    }

    function _hideModal() {
        _hiding = true;
        _elemModal.classList.remove('modal__show');
        _elemModal.classList.add('modal__hiding');
        setTimeout(function () {
            _elemModal.classList.remove('modal__hiding');
            _hiding = false;
        }, _animationSpeed);
        document.dispatchEvent(_eventHideModal);
    }

    function _handlerCloseModal(e) {
        if (e.target.dataset.dismiss === 'modal') {
            _hideModal();
        }
    }

    _elemModal = _createModal(options || {});


    _elemModal.addEventListener('click', _handlerCloseModal);
    _eventShowModal = new CustomEvent('show.modal', { detail: _elemModal });
    _eventHideModal = new CustomEvent('hide.modal', { detail: _elemModal });

    return {
        show: _showModal,
        hide: _hideModal,
        destroy: function () {
            _elemModal.parentElement.removeChild(_elemModal),
                _elemModal.removeEventListener('click', _handlerCloseModal),
                _destroyed = true;
        },
        setContent: function (html) {
            _elemModal.querySelector('[data-modal="content"]').innerHTML = html;
        },
        setTitle: function (text) {
            _elemModal.querySelector('[data-modal="title"]').innerHTML = text;
        }
    }
};

function createAuthFields(){
    return`<div>
    <input type="text" class="input_username_auth" placeholder="Enter your name here" id="input_username_auth">
    </div>
    <div>
        <input type="password" class="input_password_auth" placeholder="Enter your password here" id="input_password_auth">
    </div>
    `;
}

function createRegisterFields(){
    return`<div>
    <input type="text" class="input_username_reg" placeholder="Enter your name here" id="input_username_reg">
    </div>
    <div>
        <input type="password" class="input_password_reg" placeholder="Enter your password here" id="input_password_reg">
    </div>
    `;
}

export function createAuthForm(title) {
    const submitBtn = 'btn_login';
    const modal1 = modal({
        title: `${title}`,
        content: `<p>${createAuthFields()}</p>`,
        footerButtons: [
            { class: `${submitBtn}`, text: 'Log in', handler: 'modalHandlerOk' }
        ]
    });

    return {
        modalWindow: modal1,
        btnName : submitBtn
    };
}

export function createRegistryForm(title) {
    const submitBtn = 'btn_register';
    const modal1 = modal({
        title: `${title}`,
        content: `<p>${createRegisterFields()}</p>`,
        footerButtons: [
            { class: `${submitBtn}`, text: 'Register', handler: 'modalHandlerOk' }
        ]
    });

    return {
        modalWindow: modal1,
        btnName : submitBtn
    };
}