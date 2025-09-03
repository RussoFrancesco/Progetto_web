<?php include 'controlloaccesso.php'; ?>
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
    <meta name="description" content="">
    <meta name="author" content="">

    <title>FitnessFolio - I Miei NFT</title>

    <!-- Custom fonts for this template-->
    <script src="https://kit.fontawesome.com/35642cd6bb.js" crossorigin="anonymous"></script>
    <link
        href="https://fonts.googleapis.com/css?family=Nunito:200,200i,300,300i,400,400i,600,600i,700,700i,800,800i,900,900i"
        rel="stylesheet">

    <!-- Custom styles for this template-->
    <link href="css/sb-admin-2.min.css" rel="stylesheet">

    <style>
    .nft-card {
        transition: transform 0.3s ease;
        cursor: pointer;
        border-radius: 10px;
        overflow: hidden;
    }
    .nft-card:hover {
        transform: translateY(-5px);
        box-shadow: 0 8px 25px rgba(0,0,0,0.15);
    }
    .nft-image {
        width: 100%;
        height: 200px;
        object-fit: cover;
    }
    </style>

</head>

<body id="page-top">
 
    <!-- Page Wrapper -->
    <div id="wrapper">

        <!-- Sidebar -->
        <?php include 'sidebar.php';?>
        <!-- End of Sidebar -->
        
        <!-- Content Wrapper -->
        <div id="content-wrapper" class="d-flex flex-column">

            <!-- Main Content -->
            <div id="content">

                <!-- Topbar -->
                <?php include 'topbar.php';?>
                <!-- End of Topbar -->

                <!-- Begin Page Content -->
                <div class="container-fluid">

                    <!-- Page Heading -->
                    <div class="d-sm-flex align-items-center justify-content-between mb-4">
                        <h1 class="h3 mb-0 text-gray-800">
                            <i class="fas fa-gem text-warning"></i> I Miei NFT
                        </h1>
                    </div>

                    <!-- NFT Grid -->
                    <div class="row" id="nftContainer">
                        <!-- Loading State -->
                        <div class="col-12 text-center py-5" id="loadingState">
                            <div class="spinner-border text-primary" style="width: 3rem; height: 3rem;"></div>
                            <p class="mt-3 text-muted">Caricamento NFT...</p>
                        </div>
                    </div>

                    <!-- Empty State -->
                    <div class="row d-none" id="emptyState">
                        <div class="col-12">
                            <div class="card shadow">
                                <div class="card-body text-center py-5">
                                    <i class="fas fa-gem fa-4x text-muted mb-4"></i>
                                    <h4 class="text-muted">Nessun NFT Trovato</h4>
                                    <p class="text-muted">Il tuo portafoglio è vuoto.</p>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
                <!-- /.container-fluid -->

            </div>
            <!-- End of Main Content -->

            <!-- Footer -->
            <footer class="sticky-footer bg-white">
                <div class="container my-auto">
                    <div class="copyright text-center my-auto">
                        <span>Copyright &copy; FitnessFolio 2024</span>
                    </div>
                </div>
            </footer>
            <!-- End of Footer -->

        </div>
        <!-- End of Content Wrapper -->

    </div>
    <!-- End of Page Wrapper -->

    <!-- Logout Modal-->
    <div class="modal fade" id="logoutModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel"
        aria-hidden="true">
        <div class="modal-dialog" role="document">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="exampleModalLabel">Ready to Leave?</h5>
                    <button class="close" type="button" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">×</span>
                    </button>
                </div>
                <div class="modal-body">Select "Logout" below if you are ready to end your current session.</div>
                <div class="modal-footer">
                    <button class="btn btn-secondary" type="button" data-dismiss="modal">Cancel</button>
                    <button class="btn btn-primary" id='logout_button'>Logout</button>
                </div>
            </div>
        </div>
    </div>

    <!-- Bootstrap core JavaScript-->
    <script src="vendor/jquery/jquery.min.js"></script>
    <script src="vendor/bootstrap/js/bootstrap.bundle.min.js"></script>

    <!-- Core plugin JavaScript-->
    <script src="vendor/jquery-easing/jquery.easing.min.js"></script>

    <!-- Custom scripts for all pages-->
    <script src="js/sb-admin-2.min.js"></script>

    <!--Script per la home-->
    <script src="js/home.js"></script>

    <!-- NFT Script -->
    <script defer src="js/traguardi.js"></script>

</body>

</html>
