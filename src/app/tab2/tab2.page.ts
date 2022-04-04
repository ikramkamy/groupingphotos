import { Component } from '@angular/core';
import { PhotoService, UserPhoto } from '../services/photo.service';
import { ActionSheetController ,MenuController  } from '@ionic/angular';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page {

  constructor(public photoService: PhotoService,  public actionSheetController: ActionSheetController,private menu: MenuController) { }
  addPhotoToGallery() {
    this.photoService.addNewToGallery();
  }
  async ngOnInit() {
    await this.photoService.loadSaved();
  }
  public async showActionSheet(photo: UserPhoto, position: number) {
    const actionSheet = await this.actionSheetController.create({
      header: 'Photos',
      buttons: [{
        text: 'Delete',
        role: 'destructive',
        icon: 'trash',
        handler: () => {
          this.photoService.deletePicture(photo, position);
        }
      }, {
        text: 'Cancel',
        icon: 'close',
        role: 'cancel',
        handler: () => {
          // Nothing to do, action sheet is automatically closed
          }
      }, {
        text: 'Add to groupe',
        icon: 'add',
        role: 'add',
        handler: () => {
          // Nothing to do, action sheet is automatically closed
         this.showActionSheet2(photo,position);
        }
          }]
    });
    await actionSheet.present();
  }

  openFirst() {
    this.menu.enable(true, 'first');
    this.menu.open('first');
  }

  openEnd() {
    this.menu.open('end');
  }

  openCustom() {
    this.menu.enable(true, 'custom');
    this.menu.open('custom');
  }

  addTogroup(photo: UserPhoto,position: number){
    this.photoService.addTogroup(photo);
    }
    addTogroup2(photo: UserPhoto,position: number){
      this.photoService.addTogroup2(photo);
      }
      addTogroup3(photo: UserPhoto,position: number){
        this.photoService.addTogroup3(photo);
        }
    public async showActionSheet2(photo: UserPhoto, position: number) {
      const actionSheet = await this.actionSheetController.create({
        header: 'Photos',
        buttons: [{
          text: 'Add groupe of plants',
          role: 'add',
          icon: 'add',
          handler: () => {
            this.photoService.addTogroup(photo);
          }
        }, {
          text: 'Add groupe of vegetables',
          icon: 'add',
          role: 'add',
          handler: () => {
            // Nothing to do, action sheet is automatically closed
            this.photoService.addTogroup2(photo);
            }
        }, {
          text: 'Add groupe of fruits',
          icon: 'add',
          role: 'add',
          handler: () => {
            // Nothing to do, action sheet is automatically closed
            this.photoService.addTogroup3(photo);
          }
            }]
      });
      await actionSheet.present();
    }

}
