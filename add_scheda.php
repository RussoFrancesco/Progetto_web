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

    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@4.0.0/dist/css/bootstrap.min.css" integrity="sha384-Gn5384xqQ1aoWXA+058RXPxPg6fy4IWvTNh0E263XmFcJlSAwiGgFAW/dAiS6JXm" crossorigin="anonymous">

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
        <?php include 'sidebar.php';?>
        <!-- Content Wrapper -->
        <div id="content-wrapper" class="d-flex flex-column">
            
            <!-- Main Content -->
            <div id="content">
                <?php include 'topbar.php';?>
                <div class="container">
                    <div class="row justify-content-center">
                        <div class="col-md-8">
                            <form class='user'>

                                <h1 class="text-center">Seleziona gli esercizi da inserire</h1>

                                <div class="card">
                                    <div class="card-body">
                                        <h3>Pettorali</h3>
                                        <div class="form-check" id="pettorali"></div>
                                    </div>
                                </div>

                                <div class="card mt-3">
                                    <div class="card-body">
                                        <h3>Dorsali</h3>
                                        <div class="form-check" id="dorsali"></div>
                                    </div>
                                </div>

                                <div class="card mt-3">
                                    <div class="card-body">
                                        <h3>Spalle</h3>
                                        <div class="form-check" id="spalle"></div>
                                    </div>
                                </div>

                                <div class="card mt-3">
                                    <div class="card-body">
                                        <h3>Bicipiti</h3>
                                        <div class="form-check" id="bicipiti"></div>
                                    </div>
                                </div>

                                <div class="card mt-3">
                                    <div class="card-body">
                                        <h3>Tricipiti</h3>
                                        <div class="form-check" id="tricipiti"></div>
                                    </div>
                                </div>

                                <div class="card mt-3">
                                    <div class="card-body">
                                        <h3>Gambe</h3>
                                        <div class="form-check" id="gambe"></div>
                                    </div>
                                </div>

                                <div class="card mt-3">
                                    <div class="card-body">
                                        <h3>Addome</h3>
                                        <div class="form-check" id="addome"></div>
                                    </div>
                                </div>

                                <div class="text-center mt-3">
                                    <input type="button" class="btn btn-primary" id="invio_scheda" value="Aggiungi scheda"></input>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    
    
    <script defer src="js/add_scheda.js"></script>
    <script defer src="js/home.js"></script>
</body>
</html>