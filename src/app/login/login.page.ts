import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import * as firebase from 'firebase/app';
import { UsuarioService } from '../services/usuario.service';
import { Plugins } from '@capacitor/core';
import { FacebookLoginResponse } from '@rdlabo/capacitor-facebook-login';
import { Platform } from '@ionic/angular';
import '@codetrix-studio/capacitor-google-auth';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  constructor(
    private afAuth: AngularFireAuth,
    private usuarioService: UsuarioService,
    private platform: Platform
  ) {}

  ngOnInit() {}

  async signInWithFacebook() {
    if (this.platform.is('cordova')) {
      const { FacebookLogin } = Plugins;
      const FACEBOOK_PERMISSIONS = [
        'email',
        'user_birthday',
        'user_photos',
        'user_gender',
      ];
      const result: FacebookLoginResponse = await FacebookLogin.login({
        permissions: FACEBOOK_PERMISSIONS,
      });

      if (result.accessToken) {
        // Login successful.

        this.afAuth.auth
          .signInWithCredential(
            firebase.auth.FacebookAuthProvider.credential(
              result.accessToken.token
            )
          )
          .then((res) => {
            console.log('facebook login');
            console.log(JSON.stringify(res));
            const user = res.user;
            this.usuarioService.cargarUsuario(
              user.displayName,
              user.email,
              user.photoURL,
              user.uid,
              'facebook'
            );
          });
        console.log(`Facebook access token is ${result.accessToken}`);
      } else {
        // Cancelled by user.
        console.log('no entro');
      }
    } else {
      //web
      this.afAuth.auth
        .signInWithPopup(new firebase.auth.FacebookAuthProvider())
        .then(
          (res) => {
            console.log(res);
            const user = res.user;
            this.usuarioService.cargarUsuario(
              user.displayName,
              user.email,
              user.photoURL,
              user.uid,
              'facebook'
            );
          },
          (err) => {
            // Handle error
            console.log(err);
          }
        );
    }
  }

  async googleSignIn() {
    const googleUser = await Plugins.GoogleAuth.signIn();
    const credential = firebase.auth.GoogleAuthProvider.credential(
      googleUser.authentication.idToken
    );
    this.afAuth.auth
      .signInAndRetrieveDataWithCredential(credential)
      .then((res) => {
        const user = res.user;
        this.usuarioService.cargarUsuario(
          user.displayName,
          user.email,
          user.photoURL,
          user.uid,
          'facebook'
        );
      });
  }
}
