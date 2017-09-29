<!DOCTYPE html>
<!--  This site was created in Webflow. http://www.webflow.com -->
<!--  Last Published: Sun Mar 26 2017 18:13:22 GMT+0000 (UTC)  -->
<html data-wf-page="58d4141143c5fd5a630968a2" data-wf-site="58d4141143c5fd5a630968a1">
<head>
  <meta charset="utf-8">
  <title>Avenida Cabildo :: locales</title>
  <meta content="Administra la información de tu local para mejorar las visitas a tu local!" name="description">
  <meta content="width=device-width, initial-scale=1" name="viewport">
  <meta name="mobile-web-app-capable" content="yes">
  <link rel="manifest" href="/manifest.js?_=rtow4oo2ed5on">
  <link href="css/normalize.css?_=rtow4oo2ed5" rel="stylesheet" type="text/css">
  <link href="css/webflow.css?_=rtow4oo2ed5" rel="stylesheet" type="text/css">
  <link href="css/loader.css?_=rtow4oo2ed5" rel="stylesheet" type="text/css">
  <link href="css/avenida-cabildo-administrador.webflow.css?_=rtow4oo2ed5" rel="stylesheet" type="text/css">
  <script src="https://ajax.googleapis.com/ajax/libs/webfont/1.4.7/webfont.js?_=rtow4oo2ed5"></script>
  <script type="text/javascript">
    WebFont.load({
      google: {
        families: ["Montserrat:100,100italic,200,200italic,300,300italic,400,400italic,500,500italic,600,600italic,700,700italic,800,800italic,900,900italic"]
      }
    });
  </script>
  <script src="js/modernizr.js?_=rtow4oo2ed5" type="text/javascript"></script>
  <link href="images/5877e0982a54c5ec3ce1eee6_favicon.png" rel="shortcut icon" type="image/x-icon">
  <link href="images/5877e0a09ac381814417974d_webclip.png" rel="apple-touch-icon">
  <script src="https://www.gstatic.com/firebasejs/3.7.4/firebase.js?_=rtow4oo2ed5"></script>
  <script src="https://ajax.googleapis.com/ajax/libs/jquery/2.2.0/jquery.min.js?_=rtow4oo2ed5" type="text/javascript"></script>
  <script src="js/webflow.js?_=rtow4oo2ed5" type="text/javascript"></script>
  <script src="js/moment.js?_=rtow4oo2ed5" type="text/javascript"></script>
  <script src="js/jsrender.min.js?_=rtow4oo2ed5"></script>
  <script src="js/main.js?_=rtow4oo2ed5"></script>  
  <script src="js/debug.js?_=rtow4oo2ed5"></script>
  <script>
    env = '<?php echo ! empty($_REQUEST['env']) ? $_REQUEST['env'] : 'prod';?>'
    firebase.initializeApp(settings.env[env].firebase);
    var secondaryApp = firebase.initializeApp(settings.env[env].firebase, "Secondary");
  </script>
  <script src="https://maps.googleapis.com/maps/api/js?key=AIzaSyC3TCbJ2Bj0mVDjhLfdzz7tj7ySj7i3dAs&libraries=places"
        async defer></script>
</head>
<body>

  <div id="loading"><div class="overlay"></div><div class="bg"></div></div>
  <div class="header"></div>
  <div class="content"></div>
  <div class="footer--container"></div>

  <!-- begin templates -->
  
  <!-- ~page ~index -->  
  <script id="index" type="text/x-jsrender">
    <div class="login-section"><img class="login--img" src="images/AvenidaCabildoBlanco.svg">
      <div class="login-conteiner">
        <h3 class="login-title">Iniciar sesión</h3>
        <div class="w-form">
          <form data-name="login" id="wf-form-login" name="wf-form-login">
            <label for="email">Email</label>
            <input class="input w-input" data-name="email" id="email" maxlength="256" name="email" placeholder="Ej: Alejandro@avenidacabildo.com.ar" type="email">
            <label for="password">Contraseña</label>
            <input class="input w-input" data-name="Contraseña" id="password" maxlength="256" name="Contrase-a" placeholder="Tu contraseña" type="password"><a class="login--link" href="recuperarpass.html">¿No te acordás tu contraseña?</a>
          </form>
          <div class="error-message w-form-fail">
            <div>Ui, tu email y contraseña no coinciden.</div>
          </div>
        </div><a class="submit-button login w-button" href="#">Continuar</a>
      </div>
    </div>
  </script>

  <!-- ~component ~header -->
  <script id="header" type="text/x-jsrender">
  {{if user && user.uid == uid}}
    <a class="header-brand w-inline-block" href="http://avenidacabildo.com.ar/" target="_blank"><img src="images/AvenidaCabildo.svg">
    </a>
    <div class="header-nav"><a class="nav-item" data-section="#local" href="#">Agregar nuevo local</a><a class="nav-item" data-section="#locales" href="#">Ver locales</a><a class="nav-item salir" href="#">Cerrar Sesión</a>
    </div>
  {{else}}
    <a class="header-brand w-inline-block" href="#"><img src="images/AvenidaCabildo.svg">
    </a>
    <div class="header-nav"><a class="nav-item" data-section="#local" href="#">Tu negocio</a><a class="nav-item" data-section="#estadisticas" href="#">Estádisticas</a><a class="nav-item salir" href="#">Cerrar sesión</a>
    </div>  
  {{/if}}
  </script>

  <!-- ~component ~footer -->
  <script id="footer" type="text/x-jsrender">
  {{if user && user.uid}}
    <div class="footer-inside">
      <div class="footer--a inside session-status"></div>
    </div>
  {{else}}
    <div class="footer">
      <div><a href="http://avenidacabildo.com.ar/terminos-y-condiciones-para-comercio.html" target="_blank" class="footer--a">Términos y condiciones</a>
      </div>
      <p class="footer--p session-status">Sin inicio de sesión</p>
    </div>
  {{/if}}
  </script>

  <!-- ~component ~descuento -->
  <script id="descuento" type="text/x-jsrender">
  {{for values}}
    <div class="descuento-cont descuentos">
      <select class="_1 select w-select porcentaje">
        <option value="">Seleccionar</option>
        <option value="5%"{{if #data && #data.indexOf('5%')>-1}} selected{{/if}}>5%</option>
        <option value="10%"{{if #data && #data.indexOf('10%')>-1}} selected{{/if}}>10%</option>
        <option value="15%"{{if #data && #data.indexOf('15%')>-1}} selected{{/if}}>15%</option>
        <option value="20%"{{if #data && #data.indexOf('20%')>-1}} selected{{/if}}>20%</option>
        <option value="25%"{{if #data && #data.indexOf('25%')>-1}} selected{{/if}}>25%</option>
        <option value="30%"{{if #data && #data.indexOf('30%')>-1}} selected{{/if}}>30%</option>
        <option value="35%"{{if #data && #data.indexOf('35%')>-1}} selected{{/if}}>35%</option>
        <option value="40%"{{if #data && #data.indexOf('40%')>-1}} selected{{/if}}>40%</option>
        <option value="45%"{{if #data && #data.indexOf('45%')>-1}} selected{{/if}}>45%</option>
        <option value="50%"{{if #data && #data.indexOf('50%')>-1}} selected{{/if}}>50%</option>
        <option value="55%"{{if #data && #data.indexOf('55%')>-1}} selected{{/if}}>55%</option>
        <option value="60%"{{if #data && #data.indexOf('60%')>-1}} selected{{/if}}>60%</option>
        <option value="65%"{{if #data && #data.indexOf('65%')>-1}} selected{{/if}}>66%</option>
        <option value="70%"{{if #data && #data.indexOf('70%')>-1}} selected{{/if}}>70%</option>
        <option value="75%"{{if #data && #data.indexOf('75%')>-1}} selected{{/if}}>75%</option>
        <option value="80%"{{if #data && #data.indexOf('80%')>-1}} selected{{/if}}>80%</option>
        <option value="85%"{{if #data && #data.indexOf('85%')>-1}} selected{{/if}}>85%</option>
        <option value="90%"{{if #data && #data.indexOf('90%')>-1}} selected{{/if}}>90%</option>
        <option value="95%"{{if #data && #data.indexOf('95%')>-1}} selected{{/if}}>95%</option>
        <option value="2x1"{{if #data && #data.indexOf('2x1')>-1}} selected{{/if}}>2x1</option>
      </select>
      <select class="_1 select w-select entidad">
        <option value="">Seleccionar</option>
        {{for ~root.entidades}}
        <option value="{{>#data}}"{{if #parent.parent.data && #parent.parent.data.indexOf(#data)>-1}} selected{{/if}}>{{>#data}}</option>
        {{/for}}
      </select>
      <a class="add-descuento w-inline-block" href="#"><img src="images/add-circle.svg">
      </a>
    </div> 
  {{/for}}
  </script>
  
  <!-- ~component ~horario -->
  <script id="horario" type="text/x-jsrender">
    <div class="descuento-cont horarios_filtro">
      <select class="select select-field-2 w-select dia">
        <option value="">Día</option>
        <option value="lunes"{{if #data&&key=='lunes'}} selected{{/if}}>Lunes</option>
        <option value="martes"{{if #data&&key=='martes'}} selected{{/if}}>Martes</option>
        <option value="miercoles"{{if #data&&key=='miercoles'}} selected{{/if}}>Miércoles</option>
        <option value="jueves"{{if #data&&key=='jueves'}} selected{{/if}}>Jueves</option>
        <option value="viernes"{{if #data&&key=='viernes'}} selected{{/if}}>Viernes</option>
        <option value="sabado"{{if #data&&key=='sabado'}} selected{{/if}}>Sábado</option>
        <option value="domingo"{{if #data&&key=='domingo'}} selected{{/if}}>Domingo</option>
      </select>
      <select class="select select-field w-select abre">
        <option value="">Horario</option>
        <option value="0"{{if #data&&abre=='0'}} selected{{/if}}>0</option>
        <option value="1"{{if #data&&abre=='1'}} selected{{/if}}>1</option>
        <option value="2"{{if #data&&abre=='2'}} selected{{/if}}>2</option>
        <option value="3"{{if #data&&abre=='3'}} selected{{/if}}>3</option>
        <option value="4"{{if #data&&abre=='4'}} selected{{/if}}>4</option>
        <option value="5"{{if #data&&abre=='5'}} selected{{/if}}>5</option>
        <option value="6"{{if #data&&abre=='6'}} selected{{/if}}>6</option>
        <option value="7"{{if #data&&abre=='7'}} selected{{/if}}>7</option>
        <option value="8"{{if #data&&abre=='8'}} selected{{/if}}>8</option>
        <option value="9"{{if #data&&abre=='9'}} selected{{/if}}>9</option>
        <option value="10"{{if #data&&abre=='10'}} selected{{/if}}>10</option>
        <option value="11"{{if #data&&abre=='11'}} selected{{/if}}>11</option>
        <option value="12"{{if #data&&abre=='12'}} selected{{/if}}>12</option>
        <option value="13"{{if #data&&abre=='13'}} selected{{/if}}>13</option>
        <option value="14"{{if #data&&abre=='14'}} selected{{/if}}>14</option>
        <option value="15"{{if #data&&abre=='15'}} selected{{/if}}>15</option>
        <option value="16"{{if #data&&abre=='16'}} selected{{/if}}>16</option>
        <option value="17"{{if #data&&abre=='17'}} selected{{/if}}>17</option>
        <option value="18"{{if #data&&abre=='18'}} selected{{/if}}>18</option>
        <option value="19"{{if #data&&abre=='19'}} selected{{/if}}>19</option>
        <option value="20"{{if #data&&abre=='20'}} selected{{/if}}>20</option>
        <option value="21"{{if #data&&abre=='21'}} selected{{/if}}>21</option>
        <option value="22"{{if #data&&abre=='22'}} selected{{/if}}>22</option>
        <option value="23"{{if #data&&abre=='23'}} selected{{/if}}>23</option>
        <option value="23"{{if #data&&abre=='24'}} selected{{/if}}>24</option>
      </select>
      <select class="select select-field w-select cierra">
        <option value="">Horario</option>
        <option value="0"{{if #data&&cierra=='0'}} selected{{/if}}>0</option>
        <option value="1"{{if #data&&cierra=='1'}} selected{{/if}}>1</option>
        <option value="2"{{if #data&&cierra=='2'}} selected{{/if}}>2</option>
        <option value="3"{{if #data&&cierra=='3'}} selected{{/if}}>3</option>
        <option value="4"{{if #data&&cierra=='4'}} selected{{/if}}>4</option>
        <option value="5"{{if #data&&cierra=='5'}} selected{{/if}}>5</option>
        <option value="6"{{if #data&&cierra=='6'}} selected{{/if}}>6</option>
        <option value="7"{{if #data&&cierra=='7'}} selected{{/if}}>7</option>
        <option value="8"{{if #data&&cierra=='8'}} selected{{/if}}>8</option>
        <option value="9"{{if #data&&cierra=='9'}} selected{{/if}}>9</option>
        <option value="10"{{if #data&&cierra=='10'}} selected{{/if}}>10</option>
        <option value="11"{{if #data&&cierra=='11'}} selected{{/if}}>11</option>
        <option value="12"{{if #data&&cierra=='12'}} selected{{/if}}>12</option>
        <option value="13"{{if #data&&cierra=='13'}} selected{{/if}}>13</option>
        <option value="14"{{if #data&&cierra=='14'}} selected{{/if}}>14</option>
        <option value="15"{{if #data&&cierra=='15'}} selected{{/if}}>15</option>
        <option value="16"{{if #data&&cierra=='16'}} selected{{/if}}>16</option>
        <option value="17"{{if #data&&cierra=='17'}} selected{{/if}}>17</option>
        <option value="18"{{if #data&&cierra=='18'}} selected{{/if}}>18</option>
        <option value="19"{{if #data&&cierra=='19'}} selected{{/if}}>19</option>
        <option value="20"{{if #data&&cierra=='20'}} selected{{/if}}>20</option>
        <option value="21"{{if #data&&cierra=='21'}} selected{{/if}}>21</option>
        <option value="22"{{if #data&&cierra=='22'}} selected{{/if}}>22</option>
        <option value="23"{{if #data&&cierra=='23'}} selected{{/if}}>23</option>
        <option value="24"{{if #data&&cierra=='24'}} selected{{/if}}>24</option>
      </select>
    </div>
  </script>

  <!-- ~page ~local -->
  <script id="local" type="text/x-jsrender">
    <div class="container">
      <input type="hidden" name="key" value="{{:key}}" />

    {{if key}}
      <h3 class="heading"> {{:~prop('nombre_simple',data)}}</h3>
    {{else}}
      <h3 class="heading">Cargá un nuevo local</h3>
    {{/if}}
    
      <form class="publish__uploadimages--form" method="post" action="" name="photo" enctype="multipart/form-data">
        <input hidden="true" class="photo" type="file" name="imagen_logo" accept="image/*">
        <input hidden="true" class="photo" type="file" name="imagen_fondo" accept="image/*">
      </form>

      <div class="publish__uploadimages--info"></div>

      <div class="publish__uploadimages--preview section-photos">
        <div class="profile-picture">
          <a class="link-block w-inline-block" href="#"><img class="foto-perfil imagen_logo" src="{{if ~prop('imagen logo',data)}}{{:data['imagen logo']}}{{else}}images/profile-medidas.png{{/if}}">
          </a>
          <div class="button-container"><a class="picture-button w-button" data-name="imagen_logo" href="#">Subi una foto de perfil</a>
            <p class="picture-span">Subí una imagen en jpg o png de 500px x 500px aprox.</p>
          </div>
        </div>
        <div class="portada">
          <a class="link-block w-inline-block" href="#"><img class="foto-perfil imagen_fondo" src="{{if ~prop('imagen fondo',data)}}{{:data['imagen fondo']}}{{else}}images/portada-medidas.png{{/if}}">
          </a>
          <div class="button-container"><a class="picture-button w-button" data-name="imagen_fondo" href="#">Subi una foto de portada</a>
            <p class="picture-span">Subí una imagen en jpg o png de 800px x 458px aprox.</p>
          </div>
        </div>
      </div>
      <div class="section-info">
        <div class="conteiner-info">
          <div class="title-section">Información básica</div>
          <div class="w-form">
            <label for="nombre">Nombre del negocio</label>
            <input class="input w-input" maxlength="256" name="nombre_simple" placeholder="Avenida Cabildo" required="required" type="text" value="{{:~prop('nombre_simple',data)}}">
            <label for="direcci-n">Dirección</label>
            <input name="ubicacion_ref" type="hidden" value="{{:~prop('ubicacion',data)}}">
            <input name="direccion_ref" type="hidden" value="{{:~prop('direccion',data)}}">
            <input class="input w-input" maxlength="256" id="direccion" name="direccion" placeholder="Av. Cabildo 1394" required="required" type="text" value="{{:~prop('direccion',data)}}">
            <label for="descripci-n">Descripción sobre tu negocio</label>
            <textarea class="input w-input" maxlength="5000" name="detalle_texto" placeholder="Toda la AVENIDA en una sola aplicación.">{{:~prop('detalle texto',data)}}</textarea>
            <label for="categoria">Categoría</label>
            <select class="select w-select" name="categoria" required="required">
              <option value="">Seleccionar</option>
              {{for ~toArray(categorias)}}
              <option value="{{:key}}"{{if ~root.data && ~root.data.categoria==key}} selected{{/if}}>{{:key}}</option>
              {{/for}}
            </select>
            <label for="web">Sitio Web (Copialo y pegalo desde el navegador)</label>
            <input class="input w-input" maxlength="256" name="web" placeholder="http://www.avenicacabildo.com.ar" required="required" type="text" value="{{:~prop('web',data)}}">
          </div>
        </div>
        <div class="conteiner-info">
          <div class="title-section">Tu suscripción</div>
          <div class="w-form">
              <label for="nombre-2">Nombre</label>
              <input name="mail_suscriptor_ref" type="hidden" value="{{:~prop('mail_suscriptor',cliente)}}">
              <input class="input w-input" name="nombre_suscriptor" placeholder="María Fernanda" type="text"  value="{{:~prop('nombre_suscriptor',cliente)}}">
              <label for="email-18">Email</label>
              <input class="input w-input" maxlength="256" name="mail_suscriptor" placeholder="maria@avenidacabildo.com.ar" required="required" type="email" value="{{:~prop('mail_suscriptor',cliente)}}">
          </div>
        {{if ~isAdmin()}}
          <div class="w-form">
            <label for="nombre-2">Plan</label>          
            <select class="select w-select" name="plan" required>
              <option value="">Elegí un plan</option>
              <option value="Básico"{{if cliente && cliente.plan == 'Básico'}} selected{{/if}}>Básico</option>
              <option value="Premium"{{if cliente && cliente.plan == 'Premium'}} selected{{/if}}>Premium</option>
              <option value="Avenida Cabildo"{{if cliente && cliente.plan == 'Avenida Cabildo'}} selected{{/if}}>Avenida Cabildo</option>
            </select>          
          </div>
        {{else}}
          <div class="plan">{{:~prop('plan','Plan Básico',cliente)}}</div>
          <div class="plan-span">Para cambiar el plan escribinos a hola@avenidacabildo.com.ar</div>
        {{/if}}
          <div class="proximo-pago">El próximo vencimiento es el {{:~getProxVencimiento()}}</div>
          <a class="pago-btn open w-button" href="#">Realizar pago</a>
        {{if cliente && cliente.pagos}}
          <a class="pago-btn w-button" href="#" onclick="$('.historico-pagos').slideToggle()">Ver pagos</a>
          <div class="historico-pagos w-hidden">
          {{for cliente.pagos}}
            <label for="email-18">{{:~toDate(creado,'DD/MM/YY')}}</label>{{:origen}} {{:comprobante}}
          {{/for}}
          </div>
        {{/if}}
          <div class="proximo-pago-input w-hidden">
            <label for="email-18">Medio</label>
              <input class="input w-input" maxlength="256" name="medio" placeholder="Transferencia electrónica" type="text">
            <label for="email-18">Origen</label>
              <input class="input w-input" maxlength="256" name="origen" placeholder="Banco Santander" type="text">
            <label for="email-18">Comprobante</label>
              <input class="input w-input" maxlength="256" name="comprobante" placeholder="22928363" type="text">
              <a class="pago-btn do w-button" href="#">Realizar pago</a>
          </div>
        </div>
      </div>
      <div class="section-redes">
        <div class="conteiner-info">
          <div class="title-section">Horarios</div>
          <div class="w-form">
              <label for="de-lunes-a-viernes">Lunes a viernes</label>
              <input class="input w-input" maxlength="256" name="de-lunes-a-viernes" placeholder="Ej: de 9 a 22hs" required="required" type="text" value="{{:~getHorario('Lunes a viernes',data)}}">
              <label for="sabado">Sábados</label>
              <input class="input w-input" maxlength="256" name="sabado" placeholder="Ej: de 9 a 12" type="text" value="{{:~getHorario('Sábados',data)}}">
              <label for="domingo">Domingos</label>
              <input class="input w-input" maxlength="256" name="feriados" placeholder="ej: cerrado" type="text" value="{{:~getHorario('Feriados',data)}}">
          </div>
        </div>
        <div class="conteiner-info">
          <div class="title-section">Personalizá tu horario</div>
          <div class="w-form">
            <div class="descuento-cont">
              <label class="field-label-2" for="email-13">Día</label>
              <label class="field-label" for="email-13">Abre</label>
              <label class="field-label" for="email-13">Cierra</label>
            </div>

            <div class="horarios--container">
            </div>

            <a class="add-time" href="#">Agregar un horario más</a>
          </div>
        </div>
      </div>
      <div class="section-redes">
        <div class="conteiner-info">
          <div class="title-section">¿Cómo te contactan tus clientes?</div>
          <div class="w-form">
            <label for="telefono">Teléfono</label>
            <input class="input w-input" maxlength="256" name="telefono" placeholder="4544-4674" type="text" value="{{:~prop('telefono',data)}}">
            <label for="email-clientes">Email</label>
            <input class="input w-input" maxlength="256" name="mail" placeholder="hola@avenidacabildo.com.ar" type="email" value="{{:~prop('mail',data)}}">
            <label for="facebook">Facebook</label>
            <div class="inline">
              <div>www.facebook.com/</div>
              <input class="input w-input" maxlength="256" name="facebook" placeholder="AvenidaCabildoApp" type="text" value="{{:~prop('facebook','',data,'https://facebook.com/','')}}">
            </div>
            <label for="instagram">Instagram</label>
            <div class="inline">
              <div>www.instagram.com/</div>
              <input class="input w-input" maxlength="256" name="instagram" placeholder="avenidacabildo" type="text" value="{{:~prop('instagram','',data,'https://instagram.com/','')}}">
            </div>
          </div>
        </div>
        <div class="conteiner-info">
          <div class="title-section">Descuentos</div>
          <div class="w-form">
            <label for="descuento-av">Para quienes usen Avenida Cabildo</label>
            <input class="input w-input" maxlength="256" name="efectivo" placeholder="20%" type="text" value="{{:~prop('efectivo',data)}}">
            <label for="email-13">Descuento con tarjetas</label>

            <div class="descuento-cont">
              <select class="_1 select w-select porcentaje" disabled>
                <option value="10%">10%</option>
              </select>
              <select class="select w-select entidad" disabled>
                <option value="Avenida Cabildo">Avenida Cabildo</option>
              </select>
            </div>

            <div class="descuento--container">
            </div>
          </div>
        </div>
      </div><a class="save submit-button w-button" href="#">{{if key}}Actualizar {{:~prop('nombre_simple',data)}}{{else}}Cargar nuevo local{{/if}}</a>
    </div>
  </script>

  <!-- ~page ~locales -->
  <script id="locales" type="text/x-jsrender">
    <div class="container">
      <div class="w-form">
        <input class="input w-input keyword" maxlength="256" placeholder="Buscar local..." type="text">
      </div>
      <div class="tabs w-tabs" data-duration-in="300" data-duration-out="100">
        <div class="w-tab-menu">
          <a class="tab w--current w-inline-block w-tab-link" data-w-tab="todos">
            <div>Todos los locales</div>
          </a>
          <a class="tab w-inline-block w-tab-link" data-w-tab="Básico">
            <div>Plan Basico</div>
          </a>
          <a class="tab w-inline-block w-tab-link" data-w-tab="Premium">
            <div>Plan Premium</div>
          </a>
          <a class="tab w-inline-block w-tab-link" data-w-tab="Avenida Cabildo">
            <div>Plan Avenida Cabildo</div>
          </a>
        </div>
        <div class="w-tab-content">
          <div class="w--tab-active w-tab-pane" data-w-tab="todos">
            <div class="table">
              <div class="headerline td">
                <div class="tr">
                  <p>Local</p>
                </div>
                <div class="tr w-hidden-medium w-hidden-small w-hidden-tiny">
                  <p>Dirección</p>
                </div>
                <div class="tr w-hidden-small w-hidden-tiny">
                  <p>Email</p>
                </div>
                <div class="tr w-hidden-small w-hidden-tiny">
                  <p>Plan</p>
                </div>
                <div class="tr w-hidden-small w-hidden-tiny">
                  <p>Teléfono</p>
                </div>
                <div class="pago tr">
                  <p>Último pago</p>
                </div>
                <div class="actions tr">
                  <p>Acciones</p>
                </div>
              </div>
              <div class="locales"></div>
            </div>
          </div>
          <div class="w-tab-pane" data-w-tab="Básico">
            <div class="table">
              <div class="headerline td">
                <div class="tr">
                  <p>Local</p>
                </div>
                <div class="tr">
                  <p>Dirección</p>
                </div>
                <div class="tr">
                  <p>Email</p>
                </div>
                <div class="tr">
                  <p>Promo</p>
                </div>
                <div class="tr">
                  <p>Teléfono</p>
                </div>
                <div class="pago tr">
                  <p>Último pago</p>
                </div>
                <div class="actions tr">
                  <p>Acciones</p>
                </div>
              </div>
              <div class="locales"></div>
            </div>
          </div>
          <div class="w-tab-pane" data-w-tab="Premium">
            <div class="table">
              <div class="headerline td">
                <div class="tr">
                  <p>Local</p>
                </div>
                <div class="tr">
                  <p>Dirección</p>
                </div>
                <div class="tr">
                  <p>Email</p>
                </div>
                <div class="tr">
                  <p>Promo</p>
                </div>
                <div class="tr">
                  <p>Teléfono</p>
                </div>
                <div class="pago tr">
                  <p>Último pago</p>
                </div>
                <div class="actions tr">
                  <p>Acciones</p>
                </div>
              </div>
              <div class="locales"></div>
            </div>
          </div>
          <div class="w-tab-pane" data-w-tab="Avenida Cabildo">
            <div class="table">
              <div class="headerline td">
                <div class="tr">
                  <p>Local</p>
                </div>
                <div class="tr">
                  <p>Dirección</p>
                </div>
                <div class="tr">
                  <p>Email</p>
                </div>
                <div class="tr">
                  <p>Promo</p>
                </div>
                <div class="tr">
                  <p>Teléfono</p>
                </div>
                <div class="pago tr">
                  <p>Último pago</p>
                </div>
                <div class="actions tr">
                  <p>Acciones</p>
                </div>
              </div>
              <div class="locales"></div>            
            </div>
          </div>
        </div>
      </div>
    </div> 
  </script>

  <!-- ~component ~listadolocales -->
  <script id="listadolocales" type="text/x-jsrender">
    <div class="td" data-id="{{:key}}">
      <div class="tr">
        <p>{{:nombre_simple}}</p>
      </div>
      <div class="tr w-hidden-medium w-hidden-small w-hidden-tiny">
        <p>{{:direccion}}</p>
      </div>
      <div class="tr w-hidden-small w-hidden-tiny">
        <p>{{:mail}}</p>
      </div>
      <div class="tr w-hidden-small w-hidden-tiny">
        <p>{{if cliente &&cliente.plan}}{{:cliente.plan}}{{/if}}</p>
      </div>
      <div class="tr w-hidden-small w-hidden-tiny">
        <p>{{:telefono}}</p>
      </div>
      <div class="pago tr">
        <p class="enfecha">{{if cliente && cliente.pagos}}{{:~toDate(cliente.pagos[cliente.pagos.length-1].creado,'DD/MM')}}{{else}}&mdash;{{/if}}</p>
      </div>
      <div class="actions tr">
        <div class="table-action ver" data-ix="open-viewlocal" data-key="{{:key}}">Ver</div>
        <a class="w-inline-block" href="#">
          <div class="edit table-action" data-key="{{:key}}">Editar</div>
        </a>
        <div class="eliminar table-action" data-ix="eliminar-show" data-key="{{:key}}">Eliminar</div>
      </div>
    </div>   
  </script>

  <!-- ~page ~estadisticas -->
  <script id="estadisticas" type="text/x-jsrender">
    <div class="head-section"></div>
    <div class="estadisticas">
      <h1 class="title-stats">Tus estadísticas</h1>
      <div class="w-tabs2" data-duration-in="300" data-duration-out="100">
        <!--div class="w-tab-menu">
          <a class="tab w-inline-block w-tab-link" data-w-tab="estemes">
            <div>Este mes</div>
          </a>
          <a class="tab w--current w-inline-block w-tab-link" data-w-tab="esta-semana">
            <div>Esta semana</div>
          </a>
          <a class="tab w-inline-block w-tab-link" data-w-tab="ultimo-trimestre">
            <div>El último trimestre</div>
          </a>
        </div-->
        <div class="tab-container2 w-tab-content2">
          <div class="tab-stat w-tab-pane2" data-w-tab="estemes">
            <div class="stat-tab-cont">
              <!--div class="stat-container">
                <div class="people">380 personas</div>
                <div class="p-stat">Vieron tu perfil</div>
              </div-->
              <div class="stat-container">
                <div class="favs people">{{:personas}} personas</div>
                <div class="p-stat">Te agregaron a sus favoritos</div>
              </div>
            </div>
          </div>
          <!--div class="tab-stat w--tab-active w-tab-pane" data-w-tab="esta-semana">
            <div class="stat-tab-cont">
              <div class="stat-container">
                <div class="people">780 personas</div>
                <div class="p-stat">Vieron tu perfil</div>
              </div>
              <div class="stat-container">
                <div class="favs people">98 personas</div>
                <div class="p-stat">Te agregaron a sus favoritos</div>
              </div>
            </div>
          </div>
          <div class="tab-stat w-tab-pane" data-w-tab="ultimo-trimestre">
            <div class="stat-tab-cont">
              <div class="stat-container">
                <div class="people">678837 personas</div>
                <div class="p-stat">Vieron tu perfil</div>
              </div>
              <div class="stat-container">
                <div class="favs people">987 personas</div>
                <div class="p-stat">Te agregaron a sus favoritos</div>
              </div>
            </div>
          </div-->
        </div>
      </div>
    </div>
  </script>

  <!-- ~modal ~local -->
  <script id="modal_viewlocal" type="text/x-jsrender">
    <div class="informacion-local">
      <div class="fondo-local" style="{{if #data['imagen logo']}}background-image:url({{>#data['imagen fondo']}}){{else}}{{/if}}">
        <img class="logo-local" src="{{if #data['imagen logo']}}{{>#data['imagen logo']}}{{else}}images/5877e0a09ac381814417974d_webclip.png{{/if}}">
        <h1>{{:nombre_simple}}</h1>
        <p>{{:detalle_texto}}</p>
      </div>
      <div class="infolocal-txt">
        <p><strong>En promoción</strong>: {{if #data['en promocion']}}Sí{{else}}No{{/if}}</p>
        <p><strong>Nombre</strong>: {{:nombre_simple}}</p>
        <p><strong>Quién administra</strong>: {{:nombre_suscriptor}}</p>
        <p><strong>Email</strong>: {{:mail_suscriptor}}</p>
        <p><strong>Teléfono</strong>: {{:telefono}}</p>
        <p><strong>Dirección</strong>: {{:direccion}}</p>
        <p><strong>Horarios&nbsp;</strong>: {{:horarios.replace('\n',', ').replace('\\n',', ')}}</p>
        <p><strong>Categoría</strong>: {{:categoria}}</p>
        <p><strong>Descuentos</strong>:</p> {{if descuentos}}{{:descuentos.join(', ')}}{{/if}}
        <p><strong>Descripción</strong>: {{:~prop('detalle texto',#data)}}</p>
        <p><strong>Facebook&nbsp;</strong>: {{if facebook}}<a href="{{:facebook}}" target="_blank">{{:facebook}}</a>{{/if}}</p>
        <p><strong>Instagram&nbsp;</strong>: {{if instagram}}<a href="{{:instagram}}" target="_blank">{{:instagram}}</a>{{/if}}</p>
        <p><strong>Web&nbsp;</strong>: {{if web}}<a href="{{:web}}" target="_blank">{{:web}}</a>{{/if}}</p>
      </div>
    </div>
  </script>

  <!-- end templates -->    

  <!-- begin modals -->

  <div class="viewlocal modal" id="viewlocal">
    <div class="modal-contenedor"><img class="close close-modal" data-ix="close-viewlocal" src="images/icono-close.svg">
      <div class="modal-contenido"></div>
    </div>
  </div>

  <div class="eliminarlocal modal" id="viewlocal">
    <div class="modal-contenedor"><img class="close close-modal" data-ix="close-delete" src="images/icono-close.svg">
      <p class="modal--pcenter">¿Estás seguro que deseas eliminar este local?</p><a class="modalbutton w-button close-modal" data-ix="close-delete" href="#">No</a><a class="modalbutton w-button yes" href="#">Si</a>
    </div>
  </div>

  <div class="mensaje modal" id="mensaje">
    <div class="modal-contenedor"><img class="close close-modal" data-ix="close-mensaje" src="images/icono-close.svg">
      <p class="modal--pcenter"></p><a class="modalbutton w-button close-modal" data-ix="close-mensaje" href="#">OK</a>
    </div>
  </div>

  <!-- end modals -->


  <!-- [if lte IE 9]><script src="https://cdnjs.cloudflare.com/ajax/libs/placeholders/3.0.2/placeholders.min.js?_=rtow4oo2ed5"></script><![endif] -->
</body>
</html>
