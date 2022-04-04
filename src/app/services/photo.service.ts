import { Injectable } from '@angular/core';
import { Camera, CameraResultType, CameraSource, Photo } from '@capacitor/camera';
import { Filesystem, Directory } from '@capacitor/filesystem';
import { Storage } from '@capacitor/storage';
import { Platform } from '@ionic/angular';
@Injectable({
  providedIn: 'root'
})
export class PhotoService {
  public photos: UserPhoto[] = [];
  public photoGroup: UserPhoto[]=[];
  public photoGroup2: UserPhoto[]=[];
  public photoGroup3: UserPhoto[]=[];
  private PHOTO_STORAGE: string = 'photos';
  private platform: Platform;
  public async addNewToGallery() {
    // Take a photo
    const capturedPhoto = await Camera.getPhoto({
      resultType: CameraResultType.Uri,
      source: CameraSource.Camera,
      quality: 100
    });
      //Save the picture and add it to photo collection
  const savedImageFile = await this.savePicture(capturedPhoto);
  this.photos.unshift(savedImageFile);
  this.photos.unshift({
      filepath: "soon...",
      webviewPath: capturedPhoto.webPath
    });
  Storage.set({
      key: this.PHOTO_STORAGE,
      value: JSON.stringify(this.photos),
    });
  }
  private async readAsBase64(photo: Photo) {
    // Fetch the photo, read as a blob, then convert to base64 format
    const response = await fetch(photo.webPath!);
    const blob = await response.blob();
  
    return await this.convertBlobToBase64(blob) as string;
  }
  
  private convertBlobToBase64 = (blob: Blob) => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = reject;
    reader.onload = () => {
        resolve(reader.result);
    };
    reader.readAsDataURL(blob);
  });
  private async savePicture(photo: Photo) {  
  // Convert photo to base64 format, required by Filesystem API to save
    const base64Data = await this.readAsBase64(photo);
  
    // Write the file to the data directory
    const fileName = new Date().getTime() + '.jpeg';
    const savedFile = await Filesystem.writeFile({
      path: fileName,
      data: base64Data,
      directory: Directory.Data
    });
  
    // Use webPath to display the new image instead of base64 since it's
    // already loaded into memory
    return {
      filepath: fileName,
      webviewPath: photo.webPath
    }; }
  
  public async loadSaved() {
      // Retrieve cached photo array data
      const photoList = await Storage.get({ key: this.PHOTO_STORAGE });
      this.photos = JSON.parse(photoList.value) || [];
    // Display the photo by reading into base64 format
  for (let photo of this.photos) {
  // Read each saved photo's data from the Filesystem
  const readFile = await Filesystem.readFile({
    path: photo.filepath,
    directory: Directory.Data,
  });

  // Web platform only: Load the photo as base64 data
  photo.webviewPath = `data:image/jpeg;base64,${readFile.data}`;
}
      // more to come...
    }

  public async deletePicture(photo: UserPhoto, position: number) {
      // Remove this photo from the Photos reference data array
      this.photos.splice(position, 1);
    
      // Update photos array cache by overwriting the existing photo array
      Storage.set({
        key: this.PHOTO_STORAGE,
        value: JSON.stringify(this.photos)
      });
    
      // delete photo file from filesystem
      const filename = photo.filepath
                          .substr(photo.filepath.lastIndexOf('/') + 1);
    
      await Filesystem.deleteFile({
        path: filename,
        directory: Directory.Data
      });
    }

  public async addTogroup(photo:UserPhoto){
      this.photoGroup.unshift(photo);
      console.log("the arry of photos grouped 1",this.photoGroup)
    }
    public async addTogroup2(photo:UserPhoto){
      this.photoGroup2.unshift(photo);
      console.log("the arry of photos grouped 2",this.photoGroup2)
    }
    public async addTogroup3(photo:UserPhoto){
      this.photoGroup3.unshift(photo);
      console.log("the arry of photos grouped 3",this.photoGroup3)
    }
constructor(platform: Platform) {
      this.platform = platform;
    }
  
}
export interface UserPhoto {
  filepath: string;
  webviewPath: string;
}
