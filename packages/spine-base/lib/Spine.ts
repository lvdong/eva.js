import { Component } from '@eva/eva.js';
import { type } from '@eva/inspector-decorator';

export interface SpineParams {
  resource: string;
  animationName?: string;
  autoPlay?: boolean;
}

export default class Spine extends Component<SpineParams> {
  static componentName: string = 'Spine';

  @type('string')
  resource: string = '';

  @type('string')
  animationName: string = '';

  @type('boolean')
  autoPlay: boolean = true;

  private _armature: any;

  private waitExecuteInfos: { playType: boolean, track?: number, name?: string, loop?: boolean }[] = []

  set armature(val) {
    this._armature = val;
    if (!val) return;
    if (this.autoPlay) {
      this.play(this.animationName);
    }
    for (const info of this.waitExecuteInfos) {
      if (info.playType) {
        const { name, loop, track } = info;
        this.play(name, loop, track);
      } else {
        this.stop(info.track);
      }
    }
    this.waitExecuteInfos = [];
  }
  get armature() {
    return this._armature;
  }

  destroied: boolean;
  addHandler: any;

  lastResource: string;

  init(obj?: SpineParams) {
    if (!obj) return;

    Object.assign(this, obj);
  }
  onDestroy() {
    this.destroied = true;
  }

  play(name?: string, loop?: boolean, track?: number) {
    try {
      if (name) this.animationName = name;
      if (!this.armature) {
        this.waitExecuteInfos.push({
          playType: true,
          name,
          loop,
          track
        })
      } else {
        if (track === undefined) {
          track = 0;
        }
        this.armature.state.setAnimation(track, this.animationName, loop);
      }
    } catch (e) {
      console.log(e);
    }
  }

  stop(track?: number) {
    if (!this.armature) {
      this.waitExecuteInfos.push({
        playType: false,
        track
      })
      return;
    }
    if (track === undefined) {
      track = 0;
    }
    this.armature.state.setEmptyAnimation(track, 0);
  }

  addAnimation(name?: string, delay?: number, loop?: boolean, track?: number) {
    try {
      if (!this.armature) {
      } else {
        if (track === undefined) {
          track = 0;
        }
        this.armature.state.addAnimation(track, name, loop, delay);
      }
    } catch (e) {
      console.log(e);
    }
  }
  setMix(from: string, to: string, duration: number) {
    if (!this.armature) {
    } else {
      this.armature.stateData.setMix(from, to, duration);
    }
  }

  getAnim(track: number = 0) {
    try {
      if (!this.armature) {
      } else {
        return this.armature.state.tracks[track].animation.name;
      }
    } catch (e) {
      console.log(e);
    }
  }

  setDefaultMix(duration: number) {
    if (!this.armature) {
    } else {
      this.armature.stateData.defaultMix = duration;
    }
  }

  setAttachment(slotName: string, attachmentName: string) {
    if (!this.armature) {
      return;
    }
    this.armature.skeleton.setAttachment(slotName, attachmentName);
  }

  getBone(boneName: string) {
    if (!this.armature) {
      return;
    }
    return this.armature.skeleton.findBone(boneName);
  }
}
