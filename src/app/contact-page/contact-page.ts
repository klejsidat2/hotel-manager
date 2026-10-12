import { Component } from '@angular/core';

@Component({
  selector: 'app-contact-page',
  template: `
    <section class="page">
      <h1>Kontakt</h1>
      <p>Na shkruaj ose na telefono, do të të përgjigjemi sa më shpejt.</p>

      <div class="cards">
        <div class="card">
          <h3>📍 Adresa</h3>
          <p>Rruga Myslym Shyri, Tiranë, Shqipëri</p>
        </div>
        <div class="card">
          <h3>📞 Telefon</h3>
          <p>+355 69 000 0000</p>
        </div>
        <div class="card">
          <h3>📧 Email</h3>
          <p><a href="mailto:info@hoteltirana.al">info@hoteltirana.al</a></p>
        </div>
        <div class="card">
          <h3>🕒 Pritja</h3>
          <p>E hapur 24 orë, çdo ditë</p>
        </div>
      </div>
    </section>
  `,
  styles: `
    .page { max-width: 800px; margin: 2rem auto; padding: 0 1rem; }
    .cards { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 1rem; margin-top: 1.5rem; }
    .card { background: white; border: 1px solid #ddd; border-radius: 8px; padding: 1rem; }
    .card h3 { margin: 0 0 0.4rem; }
    .card p { margin: 0; color: #555; }
  `,
})
export class ContactPageComponent {}