import { Component, OnInit } from '@angular/core';
import { MdDialogRef } from '@angular/material';
import { AppDataLoader } from '../../../metabol.common/services'


@Component({
  selector: 'app-dialog-reaction-results',
  templateUrl: './dialog-reaction-results.component.html',
  styleUrls: ['./dialog-reaction-results.component.css']
})
export class DialogReactionResultsComponent implements OnInit {

  constructor(public dialogRef: MdDialogRef<DialogReactionResultsComponent>, private loader: AppDataLoader) { }

  pathway: string;
  fluxData: Array<any>;
  reactions: Array<any>;

  ngOnInit() {
    this.loader.get('recon2', (recon) => {
      this.reactions = [];
      recon.pathways[this.pathway.split("_")[0]]
        .forEach(x => this.reactions.push([x, this.fluxData[`${x}_max`]]));
    });
  }

}
