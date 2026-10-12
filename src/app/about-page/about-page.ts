import { Component } from '@angular/core';

@Component({
  selector: 'app-about-page',
  template: `
    <section class="page">
      <header class="intro">
        <h1>Rreth nesh</h1>
        <p class="lead">
          Hotel NewInn ofron një qëndrim të rehatshëm në zemër të kryeqytetit, me shërbim
          profesional, dhoma të mirëmbajtura dhe mikpritje që i përshtatet çdo mysafiri.
        </p>
      </header>

      <div class="block">
        <h2>Misioni ynë</h2>
        <p>
          Synojmë që çdo mysafir, qoftë në udhëtim pune apo pushimi, të ndihet i mirëpritur që në
          çastin e parë. Kombinojmë komoditetin e një hoteli modern me ngrohtësinë e mikpritjes
          shqiptare, duke u kujdesur për çdo detaj të qëndrimit tuaj.
        </p>
      </div>

      <div class="block">
        <h2>Vlerat tona</h2>
        <div class="cards">
          <div class="card">
            <h3>Mikpritje</h3>
            <p>Çdo mysafir trajtohet me respekt, vëmendje dhe gatishmëri për ndihmë.</p>
          </div>
          <div class="card">
            <h3>Cilësi</h3>
            <p>Dhoma të pastra e të mirëmbajtura dhe standarde të larta shërbimi çdo ditë.</p>
          </div>
          <div class="card">
            <h3>Transparencë</h3>
            <p>Çmime të qarta dhe rezervim i thjeshtë, pa kosto të fshehura.</p>
          </div>
        </div>
      </div>

      <div class="block">
        <h2>Shërbimet</h2>
        <ul>
          <li>Dhoma teke, dyshe dhe suita</li>
          <li>Rezervim online pa nevojë për llogari</li>
          <li>Pritje e hapur 24 orë në ditë</li>
          <li>Vendndodhje e përshtatshme pranë qendrës dhe transportit publik</li>
        </ul>
      </div>
    </section>
  `,
  styles: `
    .page { max-width: 900px; margin: 2.5rem auto; padding: 0 1rem; line-height: 1.7; color: #2d3748; }
    .intro { border-bottom: 1px solid #e2e8f0; padding-bottom: 1.5rem; margin-bottom: 2rem; }
    .intro h1 { margin: 0 0 0.8rem; color: #1a365d; }
    .lead { font-size: 1.15rem; color: #4a5568; margin: 0; }
    .block { margin-bottom: 2.2rem; }
    .block h2 { color: #1a365d; margin: 0 0 0.8rem; }
    .block p { margin: 0; }
    .cards { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 1rem; }
    .card { background: white; border: 1px solid #e2e8f0; border-radius: 8px; padding: 1.2rem; }
    .card h3 { margin: 0 0 0.4rem; color: #1a365d; }
    .card p { color: #4a5568; font-size: 0.95rem; }
    ul { margin: 0; padding-left: 1.2rem; }
    li { margin-bottom: 0.4rem; }
  `,
})
export class AboutPageComponent {}