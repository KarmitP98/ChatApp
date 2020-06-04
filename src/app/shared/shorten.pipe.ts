import { Pipe, PipeTransform } from "@angular/core";

@Pipe( {
           name: "shorten"
       } )
export class ShortenPipe implements PipeTransform {

    transform( value: string, ...args: any[] ): any {
        if ( value.length > 51 ) {
            return value.substr( 0, 51 ) + "...";
        }
        return value;
    }

}
