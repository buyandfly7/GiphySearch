import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'imagesfilter'
})
export class ImagesfilterPipe implements PipeTransform {

  transform(value: any, args?: any): any {
    return null;
  }

}
