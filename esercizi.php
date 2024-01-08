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
                    <!-- Bottoni anchor per raggiungere il relativo gruppo muscolare -->
                    <button class="btn btn-primary" onclick="window.location.href='#pettorali'">Pettorali</button>
                    <button class="btn btn-primary" onclick="window.location.href='#dorsali'">Dorsali</button>
                    <button class="btn btn-primary" onclick="window.location.href='#tricipiti'">Tricipiti</button>
                    <button class="btn btn-primary" onclick="window.location.href='#bicipiti'">Bicipiti</button>
                    <button class="btn btn-primary" onclick="window.location.href='#gambe'">Gambe</button>
                    <button class="btn btn-primary" onclick="window.location.href='#spalle'">Spalle</button>
                    <button class="btn btn-primary" onclick="window.location.href='#addome'">Addome</button>

                    <!-- Div per ogni gruppo muscolare -->
                    <h3>Pettorali</h3>
                    <div class="row" id="pettorali"></div>
                    <h3>Dorsali</h3>
                    <div class="row" id="dorsali"></div>
                    <h3>Tricipiti</h3>
                    <div class="row" id="tricipiti"></div>
                    <h3>Bicipiti</h3>
                    <div class="row" id="bicipiti"></div>
                    <h3>Gambe</h3>
                    <div class="row" id="gambe"></div>
                    <h3>Spalle</h3>
                    <div class="row" id="spalle"></div>
                    <h3>Addome</h3>
                    <div class="row" id="addome"></div>
                </div>

        </div>
    </div>

    <!-- Modal per l'inserimento dell'esercizio nella scheda -->
    <div class="modal fade" id="insertModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel"
        aria-hidden="true">
        <div class="modal-dialog" role="document">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="exampleModalLabel">Inserisci i dati dell'esercizio</h5>
                    <button class="close" type="button" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">×</span>
                    </button>
                </div>
                <div class="modal-body">
                    <input type="hidden" id="esercizio" class="hidden_esercizio">
                    <label for="num_serie">Numero di serie:</label>
                    <input type="number" class="form-control" id="num_serie">
                    <label for="num_serie">Numero di ripetizioni:</label>
                    <input type="number" class="form-control" id="num_rep">
                    <label for="num_serie">Secondi di recupero:</label>
                    <input type="number" class="form-control" id="recupero">
                </div>
                <div class="modal-footer">
                    <button class="btn btn-secondary" type="button" data-dismiss="modal">Annulla</button>
                    <button class="btn btn-primary"  id='confirm_button'>Invia</button>
                </div>
            </div>
        </div>
    </div>

    <!-- Modal per la rimozione dell'esercizio dalla scheda -->
    <div class="modal fade" id="deleteModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel"
        aria-hidden="true">
        <div class="modal-dialog" role="document">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="exampleModalLabel">Sei sicuro di voler eliminare l'esercizio dalla scheda?</h5>
                    <button class="close" type="button" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">×</span>
                    </button>
                </div>
                <div class="modal-body">
                    <input type="hidden" id="esercizio" class="hidden_esercizio_elimina">
                    Seleziona cancella se vuoi eliminare l'esercizio dalla scheda.
                </div>
                <div class="modal-footer">
                    <button class="btn btn-secondary" type="button" data-dismiss="modal">Annulla</button>
                    <button class="btn btn-danger"  id='delete_button'>Cancella</button>
                </div>
            </div>
        </div>
    </div>

    <!-- Libreria per funzioni standard -->
    <script defer src="js/home.js"></script>

    <!-- Script della pagina -->
    <script defer src="js/esercizi.js"></script>
</body>
