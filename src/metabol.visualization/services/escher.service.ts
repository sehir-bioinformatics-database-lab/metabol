import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import * as _ from 'lodash';
import * as escher from 'escher';


@Injectable()
export class EscherService {

  constructor(private http: HttpClient) { }

  options = {
    use_3d_transform: false,
    enable_editing: true,
    enable_keys: false,
    text_label: false,
    enable_tooltips: false,
    tooltip_component: false,
    scroll_behavior: 'zoom',
    full_screen_button: true,
  }

  buildReactionMap(reactionId, model, element) {
    this.options['first_load_callback'] = function(builder) {
      let size = builder.zoom_container.get_size();
      let coor = { x: size.width / 2, y: size.height / 2 - 250 };
      builder.map.new_reaction_from_scratch(reactionId, coor, 90);
      builder.map.zoom_extent_nodes();
      builder.map.select_none();
    }

    escher.Builder(null, this.escherModel(model), null, element, this.options);
  }

  buildMetaboliteMap(metaboliteId, model, element) {
    let that = this;

    this.options['first_load_callback'] = function(builder) {
      let size = builder.zoom_container.get_size();
      let coor = { x: size.width / 2, y: size.height / 2 };
      let rs = model.metabolites[metaboliteId].reactions;

      let producer = rs.filter(x => model.reactions[x].metabolites[metaboliteId] < 0);
      let consumer = rs.filter(x => model.reactions[x].metabolites[metaboliteId] > 0);
      builder.map.new_reaction_from_scratch(producer[0], coor, 0);
      let mindex = that.selected_metabolite_index(builder.map, metaboliteId);

      builder.map.new_reaction_for_metabolite(consumer[0], mindex, 180);
      // this.map.new_reaction_for_metabolite(rs[2], mindex, 60);

      builder.map.zoom_extent_nodes();
      builder.map.select_none();
    }

    escher.Builder(null, this.escherModel(model), null, element, this.options);
  }

  buildPathwayMap(pathway, model, element, callback?: (d) => void) {
    let pathwayName = pathway.split(' ').join('-').split('/').join('-').toLowerCase();
    this.http.get(`assets/datasets/visualizations/${pathwayName}.json`)
      .subscribe((data:any) => {
        let m = escher.Builder(data, this.escherModelForPathway(model, pathway), null, element, this.options);
        callback(m);
      }, () =>
        escher.Builder(null, this.escherModelForPathway(model, pathway), null, element, this.options)
      );
  }

  escherModel(model) {
    return {
      metabolites: _.values(model.metabolites),
      reactions: _.values(model.reactions),
      genes: []
    }
  }

  selected_metabolite_index(map, metabolite_id) {
    return _.toPairs(map.nodes).filter(x => x[1] == metabolite_id)[0][0];
  }

  escherModelForPathway(model, pathway) {
    return {
      metabolites: _.values(model.metabolites),
      reactions: _.values(model.reactions).filter(x => x['subsystem'] == pathway),
      genes: []
    }
  }

  setFluxData(model, fluxes) {
    model.set_reaction_data(fluxes);
  }

}
