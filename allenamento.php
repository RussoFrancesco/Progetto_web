<?php include 'controlloaccesso.php';?>
<!DOCTYPE html>
<html lang="en">

<head>

    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
    <meta name="description" content="">
    <meta name="author" content="">

    <title>SB Admin 2 - Dashboard</title>

    <script src="https://code.jquery.com/jquery-3.2.1.slim.min.js" integrity="sha384-KJ3o2DKtIkvYIK3UENzmM7KCkRr/rE9/Qpg6aAZGJwFDMVNA/GpGFF93hXpG5KkN" crossorigin="anonymous"></script>
    <script src="https://cdn.jsdelivr.net/npm/popper.js@1.12.9/dist/umd/popper.min.js" integrity="sha384-ApNbgh9B+Y1QKtv3Rn7W3mgPxhU9K/ScQsAP7hUibX39j7fakFPskvXusvfa0b4Q" crossorigin="anonymous"></script>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@4.0.0/dist/js/bootstrap.min.js" integrity="sha384-JZR6Spejh4U02d8jOt6vLEHfe/JQGiRRSQQxSfFWpi1MquVdAyjUar5+76PVCmYl" crossorigin="anonymous"></script>
    <!-- Custom fonts for this template-->
    <link href="vendor/fontawesome-free/css/all.min.css" rel="stylesheet" type="text/css">
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

                    <div class="justify-content-center" id="allenamento" style="display: none;">
                        <div class="col-auto">
                            <div class="col" id="esercizio">
                                <div class="card mb-3" id="visualizzazione">
                                    <div class="card-body" id="card-body">
                                            <h3 id="gruppo_muscolare"></h3>
                                            <h4 id="esercizio"></h4>
                                            <img id="gif_esercizio" src="#" style="display: none;">
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    

                    <div class="justify-content-left">
                            <div class="col-auto">
                                <div class="col">
                                   <button class="btn btn-success" id="inizia_allenamento">Inizia l'allenamento</button>
                                   <button class="btn btn-primary" id="modifica_scheda">Modifica la scheda</button>
                                   <button class="btn btn-danger" id="termina_allenamento" style="display: none;">Termina l'allenamento</button>
                                   <button class="btn btn-primary" id="continua" style="display: none;">Continua</button>
                                </div>
                            </div>
                    </div>
                </div>

            </div>
        </div>


    <script defer src="js/allenamenti.js"></script>
    <script defer src="js/home.js"></script>

</body>



