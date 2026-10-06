import {isTalkMatch} from './filter-talks.ts';

const form = document.querySelector<HTMLFormElement>('#talk-filters');
const input = document.querySelector<HTMLInputElement>('#talk-query');
const count = document.querySelector<HTMLElement>('#talk-count');
const empty = document.querySelector<HTMLElement>('#talk-empty');

if (form && input && count && empty) {
  const buttons = [
    ...form.querySelectorAll<HTMLButtonElement>('[aria-pressed]'),
  ];
  const rows = [
    ...document.querySelectorAll<HTMLLIElement>('#talks .talk'),
  ].map((element) => ({
    element,
    record: {
      search: element.dataset.search ?? '',
      region: element.dataset.region ?? '',
      video: element.dataset.video === 'true',
      slides: element.dataset.slides === 'true',
    },
  }));
  const update = () => {
    const selected = buttons.filter(
      (button) => button.getAttribute('aria-pressed') === 'true',
    );
    const filters = {
      query: input.value,
      resources: selected.flatMap((button) =>
        button.dataset.resource === undefined ? [] : [button.dataset.resource],
      ),
      regions: selected.flatMap((button) =>
        button.dataset.region === undefined ? [] : [button.dataset.region],
      ),
    };
    let visible = 0;
    for (const {element, record} of rows) {
      element.hidden = !isTalkMatch(record, filters);
      if (!element.hidden) {
        visible++;
      }
    }

    count.textContent = `${visible} ${visible === 1 ? 'talk' : 'talks'} of ${rows.length}`;
    empty.hidden = visible > 0;
  };

  form.addEventListener('submit', (event) => {
    event.preventDefault();
  });
  input.addEventListener('input', update);
  for (const button of buttons) {
    button.addEventListener('click', () => {
      button.setAttribute(
        'aria-pressed',
        String(button.getAttribute('aria-pressed') !== 'true'),
      );
      update();
    });
  }

  form.addEventListener('reset', () => {
    input.value = '';
    for (const button of buttons) {
      button.setAttribute('aria-pressed', 'false');
    }

    update();
  });
  update();
  form.hidden = false;
}
