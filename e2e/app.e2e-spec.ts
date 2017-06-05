import { GiphySearchPage } from './app.po';

describe('giphy-search App', () => {
  let page: GiphySearchPage;

  beforeEach(() => {
    page = new GiphySearchPage();
  });

  it('should display welcome message', done => {
    page.navigateTo();
    page.getParagraphText()
      .then(msg => expect(msg).toEqual('Welcome to app!!'))
      .then(done, done.fail);
  });
});
