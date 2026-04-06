<template>
  <div class="min-h-screen bg-gray-950 text-white">
    <nav class="fixed top-0 w-full z-50 bg-gray-950/80 backdrop-blur-md border-b border-white/5">
      <div class="max-w-7xl mx-auto px-4 md:px-6 py-4 flex items-center justify-between">
        <router-link to="/"><img src="/logo.png" alt="Wedding30s" class="h-12 md:h-20 brightness-[2]" /></router-link>
      </div>
    </nav>

    <div class="pt-24 md:pt-32 pb-16 max-w-3xl mx-auto px-4 md:px-6">
      <!-- Aviso Legal -->
      <div v-if="page === 'legal'" class="legal-content">
        <h1 class="font-serif text-3xl mb-8">Aviso Legal</h1>
        <p class="text-sm text-gray-400 mb-8">Ultima actualizacion: 6 de abril de 2026</p>

        <h2>1. Datos identificativos</h2>
        <p>En cumplimiento del articulo 10 de la Ley 34/2002, de 11 de julio, de Servicios de la Sociedad de la Informacion y de Comercio Electronico (LSSI-CE), se informa al usuario de los datos del titular:</p>
        <ul>
          <li><strong>Denominacion social:</strong> BARTINSOFT SL</li>
          <li><strong>CIF:</strong> B56799588</li>
          <li><strong>Domicilio social:</strong> Calle Hilados 20, esc dcha bajo A, Torrejon de Ardoz, Madrid</li>
          <li><strong>Registro Mercantil de Madrid:</strong> Tomo 46082, Folio 130, Hoja M-809669</li>
          <li><strong>Email de contacto:</strong> support@wedding30s.com</li>
          <li><strong>Sitio web:</strong> https://wedding30s.com</li>
        </ul>

        <h2>2. Objeto</h2>
        <p>Wedding30s es un servicio de creacion de paginas web para bodas que permite a los usuarios disenar, personalizar y publicar un sitio web para su evento. El servicio es ofrecido por BARTINSOFT SL a traves de la plataforma wedding30s.com.</p>

        <h2>3. Propiedad intelectual e industrial</h2>
        <p>Los contenidos del sitio web (diseno, codigo fuente, plantillas, logotipos, textos y graficos) son propiedad de BARTINSOFT SL o de sus licenciantes. Queda prohibida su reproduccion, distribucion o transformacion sin autorizacion expresa.</p>
        <p>Los contenidos creados por los usuarios (textos, fotografias, datos de la boda) son propiedad de los propios usuarios. BARTINSOFT SL unicamente los almacena y procesa para prestar el servicio contratado.</p>

        <h2>4. Condiciones de uso</h2>
        <p>El usuario se compromete a utilizar el sitio web de conformidad con la ley, el presente aviso legal y las buenas costumbres. El usuario se abstendra de utilizar el servicio con fines ilicitos o que puedan perjudicar derechos de terceros.</p>

        <h2>5. Limitacion de responsabilidad</h2>
        <p>BARTINSOFT SL no sera responsable de los danos derivados del uso del servicio que sean ajenos a su control, incluyendo errores u omisiones en los contenidos proporcionados por los usuarios, interrupciones del servicio por causas de fuerza mayor, o acciones de terceros.</p>

        <h2>6. Legislacion aplicable y jurisdiccion</h2>
        <p>Las presentes condiciones se rigen por la legislacion espanola. Para la resolucion de cualquier controversia, las partes se someten a los juzgados y tribunales de Madrid, salvo que la normativa aplicable disponga otra cosa.</p>
      </div>

      <!-- Politica de Privacidad -->
      <div v-else-if="page === 'privacy'" class="legal-content">
        <h1 class="font-serif text-3xl mb-8">Politica de Privacidad</h1>
        <p class="text-sm text-gray-400 mb-8">Ultima actualizacion: 6 de abril de 2026</p>

        <h2>1. Responsable del tratamiento</h2>
        <ul>
          <li><strong>Responsable:</strong> BARTINSOFT SL</li>
          <li><strong>CIF:</strong> B56799588</li>
          <li><strong>Domicilio:</strong> Calle Hilados 20, esc dcha bajo A, Torrejon de Ardoz, Madrid</li>
          <li><strong>Email:</strong> support@wedding30s.com</li>
        </ul>

        <h2>2. Datos que recopilamos</h2>
        <p>Recopilamos los siguientes datos personales:</p>
        <ul>
          <li><strong>Datos de cuenta (opcional):</strong> nombre, email, contrasena cifrada, o identificador de Google si usas inicio de sesion con Google.</li>
          <li><strong>Datos de la boda:</strong> nombres de la pareja, fecha, ubicacion, lugar de celebracion, historia, menu, programa, fotografias.</li>
          <li><strong>Datos de invitados (RSVP):</strong> nombre, email (opcional), seleccion de menu, alergias, mensaje.</li>
          <li><strong>Datos de sugerencias:</strong> email y descripcion de la sugerencia enviada.</li>
        </ul>

        <h2>3. Finalidad del tratamiento</h2>
        <p>Tratamos los datos con las siguientes finalidades:</p>
        <ul>
          <li>Crear y publicar la pagina web de la boda.</li>
          <li>Gestionar las confirmaciones de asistencia (RSVP) de los invitados.</li>
          <li>Gestionar la cuenta del usuario (si la crea).</li>
          <li>Procesar el pago a traves de Polar.sh (Merchant of Record).</li>
          <li>Enviar comunicaciones relacionadas con el servicio (confirmacion de pago, sugerencias).</li>
        </ul>

        <h2>4. Base juridica</h2>
        <ul>
          <li><strong>Ejecucion del contrato:</strong> el tratamiento es necesario para prestar el servicio contratado.</li>
          <li><strong>Interes legitimo:</strong> mejora del servicio y comunicaciones operativas.</li>
          <li><strong>Consentimiento:</strong> para el envio de sugerencias y la creacion de cuenta.</li>
        </ul>

        <h2>5. Destinatarios de los datos</h2>
        <p>Los datos pueden ser comunicados a:</p>
        <ul>
          <li><strong>Polar.sh:</strong> procesador de pagos (Merchant of Record). Gestiona la transaccion economica y la facturacion al cliente final.</li>
          <li><strong>Amazon Web Services (AWS):</strong> alojamiento de imagenes en S3 y envio de emails transaccionales via SES. Servidores en la region eu-west-3 (Paris).</li>
          <li><strong>Google:</strong> si el usuario utiliza inicio de sesion con Google, se recibe el email y nombre del perfil de Google.</li>
          <li><strong>Cloudflare:</strong> proteccion anti-bot (Turnstile) en formularios.</li>
        </ul>
        <p>No vendemos ni compartimos datos personales con terceros con fines publicitarios.</p>

        <h2>6. Transferencias internacionales</h2>
        <p>Algunos proveedores (AWS, Cloudflare, Google, Polar) pueden procesar datos fuera del EEE. En todos los casos, las transferencias se realizan con garantias adecuadas (Clausulas Contractuales Tipo, Decision de Adecuacion, o equivalentes).</p>

        <h2>7. Plazo de conservacion</h2>
        <ul>
          <li><strong>Datos de la boda y RSVP:</strong> mientras el servicio este activo. Los borradores sin pagar se eliminan automaticamente a los 7 dias.</li>
          <li><strong>Datos de cuenta:</strong> mientras la cuenta este activa.</li>
          <li><strong>Datos de pago:</strong> gestionados y conservados por Polar.sh segun su politica.</li>
        </ul>

        <h2>8. Derechos del interesado</h2>
        <p>Puedes ejercer tus derechos de acceso, rectificacion, supresion, oposicion, limitacion y portabilidad enviando un email a <strong>support@wedding30s.com</strong> indicando tu nombre y el derecho que deseas ejercer.</p>
        <p>Tambien tienes derecho a presentar una reclamacion ante la Agencia Espanola de Proteccion de Datos (AEPD) en <a href="https://www.aepd.es" target="_blank" rel="noopener" class="text-gold-400 hover:text-gold-300">www.aepd.es</a>.</p>

        <h2>9. Cookies</h2>
        <p>Wedding30s utiliza las siguientes cookies:</p>
        <ul>
          <li><strong>token (cookie de sesion):</strong> cookie tecnica httpOnly para mantener la sesion del usuario autenticado. Duracion: 7 dias. No requiere consentimiento al ser estrictamente necesaria.</li>
          <li><strong>Cloudflare Turnstile:</strong> cookies tecnicas para la verificacion anti-bot en formularios. Gestionadas por Cloudflare.</li>
        </ul>
        <p>No utilizamos cookies de analisis, publicidad ni de terceros con fines de seguimiento.</p>

        <h2>10. Seguridad</h2>
        <p>Aplicamos medidas tecnicas y organizativas adecuadas para proteger los datos: cifrado de contrasenas con bcrypt, conexiones HTTPS, tokens JWT en cookies httpOnly, y almacenamiento seguro en AWS.</p>
      </div>

      <!-- Terminos y Condiciones -->
      <div v-else-if="page === 'terms'" class="legal-content">
        <h1 class="font-serif text-3xl mb-8">Terminos y Condiciones</h1>
        <p class="text-sm text-gray-400 mb-8">Ultima actualizacion: 6 de abril de 2026</p>

        <h2>1. Descripcion del servicio</h2>
        <p>Wedding30s es un servicio de creacion de paginas web para bodas operado por BARTINSOFT SL. El usuario puede disenar y previsualizar su pagina web de boda de forma gratuita. La publicacion de la pagina web requiere un pago unico de 29 EUR.</p>

        <h2>2. Proceso de compra y pago</h2>
        <p>El pago se realiza a traves de Polar.sh, que actua como Merchant of Record (comercializador autorizado). Polar.sh es el vendedor legal de la transaccion y se encarga de:</p>
        <ul>
          <li>Cobrar el importe al cliente.</li>
          <li>Gestionar el IVA y los impuestos aplicables segun el pais del comprador.</li>
          <li>Emitir la factura al cliente final.</li>
        </ul>
        <p>BARTINSOFT SL recibe el importe neto como proveedor del servicio.</p>

        <h2>3. Derecho de desistimiento</h2>
        <p>De conformidad con el articulo 103.a) del Real Decreto Legislativo 1/2007, el derecho de desistimiento no aplica a contenidos digitales suministrados en un soporte no material cuya ejecucion haya comenzado con el consentimiento previo del consumidor. Al completar el pago y publicar la pagina web, el usuario consiente el inicio inmediato de la prestacion del servicio.</p>
        <p>No obstante, si el usuario no esta satisfecho con el servicio, puede contactar con support@wedding30s.com para evaluar su caso.</p>

        <h2>4. Funcionamiento del servicio</h2>
        <ul>
          <li>El usuario crea y configura su pagina web de boda a traves del editor online.</li>
          <li>La previsualizacion y el enlace de preview son gratuitos.</li>
          <li>Tras el pago, la pagina se publica en una URL publica (wedding30s.com/[slug]).</li>
          <li>Los invitados pueden acceder a la pagina, ver la informacion de la boda y confirmar su asistencia (RSVP).</li>
          <li>El usuario puede editar la pagina despues de publicarla.</li>
        </ul>

        <h2>5. Cuenta de usuario</h2>
        <p>La creacion de una cuenta es opcional y se ofrece despues del pago. La cuenta permite al usuario gestionar sus bodas desde cualquier dispositivo. El usuario es responsable de mantener la confidencialidad de sus credenciales.</p>

        <h2>6. Contenido del usuario</h2>
        <p>El usuario es el unico responsable del contenido que sube a la plataforma (textos, fotografias, datos). El usuario garantiza que dispone de los derechos necesarios sobre dicho contenido y que este no infringe derechos de terceros.</p>
        <p>BARTINSOFT SL se reserva el derecho de eliminar contenido que sea ilegal, ofensivo o que infrinja estos terminos.</p>

        <h2>7. Disponibilidad del servicio</h2>
        <p>BARTINSOFT SL hara esfuerzos razonables para mantener el servicio disponible. No obstante, no garantiza la disponibilidad ininterrumpida del servicio y no sera responsable de interrupciones temporales por mantenimiento, actualizaciones o causas de fuerza mayor.</p>

        <h2>8. Limitacion de responsabilidad</h2>
        <p>La responsabilidad maxima de BARTINSOFT SL estara limitada al importe abonado por el usuario (29 EUR). BARTINSOFT SL no sera responsable de danos indirectos, perdida de datos del usuario por causas ajenas a su control, ni del uso que los invitados hagan de la informacion publicada en la pagina web.</p>

        <h2>9. Modificacion de los terminos</h2>
        <p>BARTINSOFT SL puede modificar estos terminos en cualquier momento. Los cambios se publicaran en esta pagina. El uso continuado del servicio tras la publicacion de los cambios implica la aceptacion de los nuevos terminos.</p>

        <h2>10. Legislacion y jurisdiccion</h2>
        <p>Estos terminos se rigen por la legislacion espanola. Para la resolucion de controversias, las partes se someten a los juzgados y tribunales de Madrid, sin perjuicio de los derechos que correspondan al consumidor segun la normativa aplicable.</p>

        <h2>11. Contacto</h2>
        <p>Para cualquier consulta sobre estos terminos, puedes escribir a <strong>support@wedding30s.com</strong>.</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const page = computed(() => route.params.page as string)
</script>

<style scoped>
.legal-content h2 {
  @apply font-serif text-xl text-white mt-8 mb-3;
}

.legal-content p {
  @apply text-gray-300 text-sm leading-relaxed mb-3;
}

.legal-content ul {
  @apply list-disc pl-6 mb-4 space-y-1;
}

.legal-content li {
  @apply text-gray-300 text-sm leading-relaxed;
}

.legal-content a {
  @apply text-gold-400 hover:text-gold-300 transition-colors;
}
</style>
