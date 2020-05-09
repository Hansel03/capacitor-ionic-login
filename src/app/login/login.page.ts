import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import * as firebase from 'firebase/app';
import { UsuarioService } from '../services/usuario.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  constructor(
    private afAuth: AngularFireAuth,
    private usuarioService: UsuarioService,
    private router: Router
  ) {}

  ngOnInit() {}

  signInWithFacebook() {
    this.afAuth.auth
      .signInWithPopup(new firebase.auth.FacebookAuthProvider())
      .then((res) => {
        console.log(res);
        const user = res.user;
        this.usuarioService.cargarUsuario(
          user.displayName,
          user.email,
          user.photoURL,
          user.uid,
          'facebook'
        );

        this.router.navigate(['home']);
      });
  }
}
