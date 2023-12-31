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

                <!-- Div per la visualizzazione della scheda -->
                <div class="container">
                    <div class="row">
                        <div class="col">
                            <h1 id='attuale_passata'>Scheda</h1>
                            <!-- Form per la modifica della scheda -->
                            <form class="user">
                            <div id="scheda_attuale"></div>
                            <br>
                            <div id="esercizi_mancanti"></div>
                            </form>
                        </div>
                    </div>
                    <div class="row justify-content-end mt-3">
                        <div class="col-auto">
                            <button class="btn btn-primary btn-lg" id="modifica_scheda" style="display: none;">Modifica Scheda</button>
                        </div>
                        <div class="col-auto" id="modifica_buttons" style="display: none;">
                            <button class="btn btn-secondary btn-lg" id="annulla_modifica">Annulla Modifica</button>
                            <button class="btn btn-success btn-lg" id="conferma_modifica">Conferma Modifica</button>
                        </div>
                        <div class="col-auto">
                            <button class="btn btn-danger btn-lg" id="button_terminazione_scheda" data-toggle="modal" data-target="#Modal_chiusura" style="display:none">Termina Scheda</button>
                        </div>
                    </div>
                </div>
            </div>
    </div>


    
    <!-- Modal chiusura scheda-->
    <div class="modal fade" id="Modal_chiusura" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel"
        aria-hidden="true">
        <div class="modal-dialog" role="document">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="exampleModalLabel">Sicuro di voler chiudere la scheda?</h5>
                    <button class="close" type="button" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">×</span>
                    </button>
                </div>
                <div class="modal-body">Seleziona "Conferma" se vuoi chiudere la scheda corrente alla data di oggi.
                </div>
                <div class="modal-footer">
                    <button class="btn btn-secondary" type="button" data-dismiss="modal">Cancel</button>
                    <button class="btn btn-danger"  id='modal_terminazione_scheda'>Termina Scheda</button>
                </div>
            </div>
        </div>
    </div>

    <!-- Libreria per funzioni standard -->
    <script defer src="js/home.js"></script>

    <!-- Script della pagina -->
    <script defer src="js/pagina_scheda.js"></script>

    <!-- Custom scripts for all pages-->
    <script src="js/sb-admin-2.min.js"></script>

</body>



