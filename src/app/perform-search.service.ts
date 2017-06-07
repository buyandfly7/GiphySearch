import { Injectable } from '@angular/core';
import {Http, Response} from '@angular/http';

@Injectable()
export class PerformSearchService {
  link = 'http://api.giphy.com/v1/gifs/search?api_key=dc6zaTOxFJmzC&q=';
  http: Http;
  giphies = [];
  inputField = '';
  checkModel = false;
  public bigCurrentPage = 1;
  public bigTotalItems: number;
  constructor(http: Http) {
    this.http = http;
  }
  pageChanged(event: any) {
    const apiLink = this.link + this.inputField + '&limit=20' + '&offset=' + event.page * 20;
    this.http.request(apiLink)
        .subscribe((res: Response) => {
          this.giphies = [];
          this.giphies = res.json().data;
          this.bigTotalItems = res.json().pagination.total_count;
          console.log(res.json());
        });
  }
  performSearch(searchTerm) {
    setTimeout(() => {
      const apiLink = this.link + searchTerm.value;
      this.giphies = [];
      this.http.request(apiLink)
          .subscribe((res: Response) => {
            this.giphies = res.json().data;
            this.bigTotalItems = res.json().pagination.total_count;
            console.log(res.json());
          });
      this.bigCurrentPage = 1;
    }, 300)
  }
}
