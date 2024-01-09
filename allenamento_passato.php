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

                <!-- Div dell'allenamento -->
                <div class="container">
                    <h2 id="allenamento">Allenamento del</h2>
                        <!-- Card per ogni gruppo muscolare con i relativi esercizi -->
                                <div class="card mt-3" id="card_pettorali" style="display: none;">
                                    <div class="card-header" >
                                        <h3>Pettorali</h3>
                                    </div>
                                    <div class="card-body" id="pettorali"></div>
                                </div>

                                <div class="card mt-3" id="card_dorsali" style="display: none;">
                                    <div class="card-header">
                                        <h3>Dorsali</h3>
                                    </div>
                                    <div class="card-body" id="dorsali"></div>
                                </div>

                                <div class="card mt-3" id="card_spalle" style="display: none;">
                                    <div class="card-header">
                                        <h3>Spalle</h3>
                                    </div>
                                    <div class="card-body" id="spalle"></div>
                                </div>

                                <div class="card mt-3" id="card_bicipiti" style="display: none;">
                                    <div class="card-header">
                                        <h3>Bicipiti</h3>
                                    </div>
                                    <div class="card-body" id="bicipiti"></div>
                                </div>

                                <div class="card mt-3" id="card_tricipiti" style="display: none;">
                                    <div class="card-header">
                                        <h3>Tricipiti</h3>
                                    </div>
                                    <div class="card-body" id="tricipiti"></div>
                                </div>

                                <div class="card mt-3" id="card_gambe" style="display: none;">
                                    <div class="card-header">
                                        <h3>Gambe</h3>
                                    </div>
                                    <div class="card-body" id="gambe"></div>
                                </div>

                                <div class="card mt-3" id="card_addome" style="display: none;">
                                    <div class="card-header">
                                        <h3>Addome</h3>
                                    </div>
                                    <div class="card-body" id="addome"></div>  
                                </div>
                

                    
                </div>

        </div>
    </div>

    <!-- Libreria per funzioni standard -->
    <script defer src="js/home.js"></script>

    <!-- Script della pagina -->
    <script defer src="js/mostra_allenamento.js"></script>
    
    <!-- Custom scripts for all pages-->
    <script src="js/sb-admin-2.min.js"></script>

</body>
