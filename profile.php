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
                                        <button type="button" class="btn btn-primary" id="button_modifica">Modifica</button>
                                    </div>
                                </form>
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