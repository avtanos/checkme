import React from 'react';
import './Footer.css';

function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer__content">
          <div className="footer__section">
            <h4>Правовая информация</h4>
            <ul className="footer__links">
              <li>
                <a href="#/offer" className="footer__link">Договор оферты</a>
              </li>
              <li>
                <a href="#/privacy" className="footer__link">Конфиденциальность данных</a>
              </li>
            </ul>
          </div>

          <div className="footer__section">
            <h4>Техподдержка</h4>
            <div className="footer__contacts">
              <p>
                <strong>Email:</strong>{' '}
                <a href="mailto:support@checkme.kg" className="footer__link">
                  support@checkme.kg
                </a>
              </p>
              <p>
                <strong>Телефон:</strong>{' '}
                <a href="tel:+996312123456" className="footer__link">
                  +996 (312) 123-45-67
                </a>
              </p>
            </div>
          </div>

          <div className="footer__section">
            <h4>О проекте</h4>
            <p className="footer__text">
              Карта провайдеров услуг Кыргызстана. 
              Найдите мастера и свяжитесь с ним напрямую.
            </p>
          </div>
        </div>

        <div className="footer__bottom">
          <p>&copy; {new Date().getFullYear()} CheckMe. Все права защищены.</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
