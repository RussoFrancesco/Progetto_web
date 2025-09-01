<?php include 'controlloaccesso.php';?>
<!DOCTYPE html>
<html lang="en">

<head>

    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
    <meta name="description" content="">
    <meta name="author" content="">

    <title>FitnessFolio</title>

    <script src="https://code.jquery.com/jquery-3.2.1.slim.min.js" integrity="sha384-KJ3o2DKtIkvYIK3UENzmM7KCkRr/rE9/Qpg6aAZGJwFDMVNA/GpGFF93hXpG5KkN" crossorigin="anonymous"></script>
    <script src="https://cdn.jsdelivr.net/npm/popper.js@1.12.9/dist/umd/popper.min.js" integrity="sha384-ApNbgh9B+Y1QKtv3Rn7W3mgPxhU9K/ScQsAP7hUibX39j7fakFPskvXusvfa0b4Q" crossorigin="anonymous"></script>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@4.0.0/dist/js/bootstrap.min.js" integrity="sha384-JZR6Spejh4U02d8jOt6vLEHfe/JQGiRRSQQxSfFWpi1MquVdAyjUar5+76PVCmYl" crossorigin="anonymous"></script>
    <!-- Custom fonts for this template-->
    <script src="https://kit.fontawesome.com/35642cd6bb.js" crossorigin="anonymous"></script>
    <link
        href="https://fonts.googleapis.com/css?family=Nunito:200,200i,300,300i,400,400i,600,600i,700,700i,800,800i,900,900i"
        rel="stylesheet">

    <!-- Custom styles for this template-->
    <link href="css/sb-admin-2.min.css" rel="stylesheet">

</head>
<body id="page-top">
    
    <!-- Page Wrapper -->
    <div id="wrapper">

        <!-- Sidebar -->
        <?php include 'sidebar.php';?>

        <!-- Content Wrapper -->
        <div id="content-wrapper" class="d-flex flex-column">

            <!-- Main Content -->
            <div id="content">
                <!-- Topbar -->
                <?php include 'topbar.php';?>
                <!-- End of Topbar -->

                <div class="container">
                    <!-- Div della selezione dei gruppi da allenare -->
                    <div class="justify-content-left" id="selezione">
                            <div class="col-auto">
                                <div class="col">
                                    <h1 id='titolo_allenamento'>Inizio allenamento</h1>
                                    <h2>Seleziona i gruppi muscolari da allenare</h2>
                                    <form class="user" id="esercizi_allenare">
                                    <div id="scheda"></div>
                                    </form>
                                </div>
                            </div>
                    </div>

                    <!-- Div della funzione di allenamento -->
                    <div class="container">
                        <div class="row justify-content-center" id="allenamento" style="display: none;">
                            <div class="col-auto">
                                <div class="card">
                                    <div class="card-body text-center">
                                        <div id="esercizio">
                                            <h3 class="card-title" id="gruppo_muscolare"></h3>
                                            <h4 class="card-text" id="singolo_esercizio"></h4>
                                            <div class="d-flex justify-content-center align-items-center mb-3">
                                                <img id="gif_esercizio" src="#" style="display: none;" class="img-fluid">
                                            </div>
                                            <div class="col-auto" id="info_esercizio">
                                                <h5 id="info_serie"></h5>
                                                <h5 id="info_ripetizioni"></h5>
                                                <h5 id="info_recupero"></h5>
                                                <h5 id="serie_rimanenti"></h5>
                                                <button id="recupera" class="btn btn-primary">Recupera</button>
                                                <div class="progress progress-sm mb-2" id="bar">
                                                        <div id="progress-bar" class="progress-bar" role="progressbar" style="width: 0%; display: none;" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100"></div>
                                                </div>
                                            </div>
                                            <div class="form-check 'd-flex flex-row align-items-center" id="form_peso">
                                                <form class="form-horizontal">
                                                    <input type="number" name="peso" id="peso" class="form-control form-control-user" placeholder="Peso" style="display: none;" required min="0">
                                                </form>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Div bottoni -->
                    <div class="d-flex justify-content-between">
                        <div>
                            <button class="btn btn-success mr-2" id="inizia_allenamento">Inizia l'allenamento</button>
                            <button class="btn btn-primary mr-2" id="modifica_scheda">Modifica la scheda</button>
                            <button class="btn btn-primary" id="continua" style="display: none;">Continua</button>
                        </div>
                        <button class="btn btn-danger mr-2" id="termina_allenamento" style="display: none;">Termina l'allenamento</button>
                    </div>
                </div>
            </div>
        </div>

    <!-- Libreria per funzioni standard -->
    <script defer src="js/home.js"></script>

    <script src="https://cdnjs.cloudflare.com/ajax/libs/crypto-js/4.0.0/crypto-js.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/elliptic/6.5.4/elliptic.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/js-sha256@0.9.0/build/sha256.min.js"></script>
    <script src="js/CircularProtocolAPI.js"></script>

    <!-- Script della pagina -->
    <script defer src="js/allenamenti.js"></script>
    
    <!-- Custom scripts for all pages-->
    <script src="js/sb-admin-2.min.js"></script>
</body>



