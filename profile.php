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
        <?php include 'sidebar.php'; ?>
        <!-- End of Sidebar -->

        <!-- Content Wrapper -->
        <div id="content-wrapper" class="d-flex flex-column">

            <!-- Main Content -->
            <div id="content">

                <!-- Topbar -->
                <?php include 'topbar.php';?>
                <!-- End of Topbar -->
                
                <div class="justify-content-center">
                    <div class="col-auto">
                        <div class="col">
                            <!-- Div per la visualizzazione dei dati --> 
                            <div class="p-2">
                                <div class="text-center">
                                    <h1 class="h4 text-gray-900 mb-4">Il tuo profilo</h1>
                                </div>
                                <!-- Form per la modifica dei dati del profilo -->
                                <form class="user" id="modify" method="PUT">
                                    <div class="form-group">
                                        <label class="p">Nome:</label>
                                        <input type="text" class="form-control form-control-user" name="FirstName" id="FirstName"
                                            placeholder="First Name"  required>
                                    </div>
                                    <div class="form-group">
                                        <label class="p">Cognome:</label>
                                        <input type="text" class="form-control form-control-user" name="LastName" id="LastName"
                                            placeholder="Last Name"  required> 
                                    </div>
                                    <div class="form-group">
                                        <label class="p">Email:</label>
                                        <input type="email" class="form-control form-control-user" name="Email" id="Email"
                                            placeholder="Email Address"  required>
                                    </div>
                                    <div class="form-group">
                                        <label class="p">Telefono:</label>
                                        <input type="tel" class="form-control form-control-user" name="Phone" id="Phone"
                                        placeholder="Phone Number (optional)"  required>
                                    </div>
                                    <div class="form-group" id="modifica">
                                        <button type="button" class="btn btn-primary" id="button_modifica">Conferma modifiche</button>
                                    </div>
                                    <div class="form-group">
                                        <button type="button" class="btn btn-danger" id="elimina" data-toggle="modal" data-target="#deleteModal">Elimina account</button>
                                    </div>
                                </form>
                            </div>
                    </div>
                </div>

                <!-- Logout Modal-->
                <div class="modal fade" id="deleteModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel"
                    aria-hidden="true">
                    <div class="modal-dialog" role="document">
                        <div class="modal-content">
                            <div class="modal-header">
                                <h5 class="modal-title">Sei sicuro?</h5>
                                <button class="close" type="button" data-dismiss="modal" aria-label="Close">
                                    <span aria-hidden="true">×</span>
                                </button>
                            </div>
                            <div class="modal-body">Perderai tutti i progressi e i dati.</div>
                            <div class="modal-footer">
                                <button class="btn btn-secondary" type="button" data-dismiss="modal">Cancel</button>
                                <button class="btn btn-danger"  id='button_elimina'>Elimina</button>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Libreria per funzioni standard -->
                <script defer src="js/home.js"></script>

                <!-- Script della pagina-->
                <script defer src="js/profile.js"></script>
                
                <!-- Custom scripts for all pages-->
                <script src="js/sb-admin-2.min.js"></script>
</body>