var selectedTreeNode = null;
var selectedProduct = null;
var productImages = [];
var smallImage = null;
var largeImages = [];
var countries = [];
var manufacturers = [];
var brands = [];

$(document).ready(function () {
    $.jqx.theme = 'bootstrap';
    
    $.ajax({
        type: "GET",
        url: "/MegaMarket/Admin/Office/GetGroupCategories",
        success: function (data) {
            var source =
                {
                    datatype: "json",
                    datafields: [
                        { name: 'id' },
                        { name: 'parentId' },
                        { name: 'expanded' },
                        { name: 'name' },
                        { name: 'orderBy' },
                        { name: 'mainGroupId' },
                        { name: 'path' },
                        { name: 'icon' }
                    ],
                    id: 'id',
                    localdata: data
                };

            var dataAdapter = new $.jqx.dataAdapter(source);
            dataAdapter.dataBind();

            var records = dataAdapter.getRecordsHierarchy('id', 'parentId', 'items', [{ name: 'name', map: 'label' }]);

            $('#jqxTree').jqxTree({
                source: records, height: '600px', width: '100%', toggleMode: 'dblclick', allowDrag: false, allowDrop: false
            });

            $('#jqxTree').css('visibility', 'visible');

            $('#jqxTree').on('select', function (event) {
                var selectedItem = $('#jqxTree').jqxTree('selectedItem');
                if (selectedItem != null && selectedItem.id != 1) {
                    selectedTreeNode = selectedItem;

                    $('#btnAdd').show();
                    $('#btnDelete').show();

                    InitProductsGrid(selectedTreeNode.id);

                    $('#addEditProductForm').hide();
                }                
            });
        }
    });

    $("#uploadImageSmall").css('color', 'transparent');
    $("#uploadImageLarge").css('color', 'transparent');

    $("#uploadImageSmall").on('change', function () {
        $("#uploadImageSmall").css('color', '#333');
        $("#uploadImageSmall").css('font-weight', 'bold');
    });
    $("#uploadImageLarge").on('change', function () {
        $("#uploadImageLarge").css('color', '#333');
        $("#uploadImageLarge").css('font-weight', 'bold');
    });

    $.ajax({
        type: "GET",
        url: "/MegaMarket/Admin/Office/GetCountriesManufacturersBrands",
        success: function (response) {
            $('#grdProducts').on('rowclick', function (event) {
                selectedProduct = event.args.row.bounddata;

                $("#jqxCountries").jqxComboBox('selectIndex', countries.Select('id').indexOf(selectedProduct.country.id));
                $("#jqxManufacturers").jqxComboBox('selectIndex', manufacturers.Select('id').indexOf(selectedProduct.manufacturer.id));
                $("#jqxBrands").jqxComboBox('selectIndex', brands.Select('id').indexOf(selectedProduct.brand.id));

                $.ajax({
                    type: "GET",
                    url: "/MegaMarket/Admin/Office/GetProductImagesByProductId/" + selectedProduct.id,
                    success: function (response) {
                        productImages = response.productImages;
                        smallImage = response.smallImage;
                        largeImages = response.largeImages;

                        InitProductForm(false);
                    }
                });

                $('#addEditProductTitle').text('საქონლის რედაქტირება');
                $('#addEditProductForm').show();

                $('#productName').val(selectedProduct.name);
                $('#productCode').val(selectedProduct.code);
                $('#productDescription').val(selectedProduct.description);
            });


            countries = response.countries;
            manufacturers = response.manufacturers;
            brands = response.brands;

            $("#jqxCountries").jqxComboBox({ source: response.countries, displayMember: "name", valueMember: "id", width: '300' });
            $("#jqxManufacturers").jqxComboBox({ source: response.manufacturers, displayMember: "name", valueMember: "id", width: '300' });
            $("#jqxBrands").jqxComboBox({ source: response.brands, displayMember: "name", valueMember: "id", width: '300' });
        }
    });    
});

function InitProductsGrid(groupCategoryId) {
    // prepare the data
    var source =
    {
        datatype: "json",
        datafields: [
            { name: 'id', type: 'int' },
            { name: 'name', type: 'string' },
            { name: 'code', type: 'string' },
            { name: 'description', type: 'string' },
            { name: 'groupCategoryId', type: 'int' },
            { name: 'country' },
            { name: 'manufacturer' },
            { name: 'brand' }
        ],
        url: "/MegaMarket/Admin/Office/GetProductsByGroupCategoryId/" + groupCategoryId
    };
    var dataAdapter = new $.jqx.dataAdapter(source, {
        downloadComplete: function (data, status, xhr) { },
        loadComplete: function (data) { },
        loadError: function (xhr, status, error) { }
    });

    groupCategoryParams = dataAdapter;

    // initialize jqxGrid
    $("#grdProducts").jqxGrid(
    {
        width: '100%',
        height: 565,
        source: dataAdapter,
        columns: [
          { text: 'დასახელება', datafield: 'name' },
          { text: 'კოდი', datafield: 'code' }
        ]
    });
}

function AddProduct() {
    $('#addEditProductTitle').text('საქონლის დამატება');
    $('#addEditProductForm').show();

    $('#productName').val('');
    $('#productCode').val('');
    $('#productDescription').val('');

    $('#smlImg').empty();
    $('#lrgImgs').empty();

    selectedProduct = null;
    productImages = [];
    smallImage = null;

    $("#jqxCountries").jqxComboBox({ source: countries, displayMember: "name", valueMember: "id", width: '300' });
    $("#jqxManufacturers").jqxComboBox({ source: manufacturers, displayMember: "name", valueMember: "id", width: '300' });
    $("#jqxBrands").jqxComboBox({ source: brands, displayMember: "name", valueMember: "id", width: '300' });

    $("#jqxCountries").jqxComboBox('selectIndex', 0);
    $("#jqxManufacturers").jqxComboBox('selectIndex', 0);
    $("#jqxBrands").jqxComboBox('selectIndex', 0);

    InitProductForm(true);
}

function SaveProduct() {   
    var smallFiles = $("#uploadImageSmall").get(0).files;
    var largeFiles = $("#uploadImageLarge").get(0).files;

    if (smallFiles.length > 0) {
        SaveSmallImageBase(smallFiles, largeFiles);
    } else {
        if (largeFiles.length > 0) {
            SaveLargeImageBase(largeFiles);
        } else {
            SaveProductBase();
        }
    }    
}

function SaveSmallImageBase(smallFiles, largeFiles) {
    //save small images   
    var smallData = new FormData();
    smallData.append("SmallImage", smallFiles[0]);

    $.ajax({
        type: 'POST',
        url: '/MegaMarket/Admin/Office/SaveSmallProductImages',
        processData: false,
        contentType: false,
        data: smallData,
        success: function (response) {
            smallImage = response;

            if (largeFiles.length > 0) {
                SaveLargeImageBase(largeFiles);
            } else {
                SaveProductBase();
            }
        }
    });
    //---
}

function SaveLargeImageBase(largeFiles) {
    //save large images                
    var largeData = new FormData();
    for (var i = 0; i < largeFiles.length; i++) {
        largeData.append(i, largeFiles[i]);
    }

    $.ajax({
        type: 'POST',
        url: '/MegaMarket/Admin/Office/SaveLargeProductImages',
        processData: false,
        contentType: false,
        data: largeData,
        success: function (response) {
            largeImages = response;

            productImages.push({
                id: productImages.length == 0 ? 0 : productImages[0].id,
                imageLarge: largeImages[0],
                productId: selectedProduct == null ? 0 : selectedProduct.id
            });

            for (var i = 1; i < largeImages.length; i++) {
                productImages.push({
                    id: productImages.length == 0 ? 0 : productImages[0].id,
                    imageLarge: largeImages[i],
                    productId: selectedProduct == null ? 0 : selectedProduct.id
                });
            }

            SaveProductBase();
        }
    });
    //---
}

function SaveProductBase(toDelete) {
    //save product
    var model = {
        id: selectedProduct == null ? 0 : selectedProduct.id,
        name: $('#productName').val(),
        code: $('#productCode').val(),
        description: $('#productDescription').val(),
        groupCategoryId: selectedTreeNode.id,
        productImages: productImages,
        imageSmall: smallImage,
        deleted: toDelete,
        countryId: $("#jqxCountries").jqxComboBox('getSelectedItem').value,
        manufacturerId: $("#jqxManufacturers").jqxComboBox('getSelectedItem').value,
        brandId: $("#jqxBrands").jqxComboBox('getSelectedItem').value
    }

    $.ajax({
        type: "POST",
        url: "/MegaMarket/Admin/Office/SaveProduct",
        data: model,
        success: function (data) {
            InitProductsGrid(selectedTreeNode.id);
            InitProductForm(false);
            $('#addEditProductForm').hide();

            //window.location.reload();
        }
    });
    //---
}

function CancelSaveProduct() {
    window.location.reload();
}

function InitProductForm(clearImages) {    
    if (!clearImages) {
        $('#smlImg').empty();
        $('#lrgImgs').empty();

        !IsUndefinedNullOrEmpty(smallImage) ? $('#smlImg').append('<a onclick="DeleteSmallImage()" style="margin-bottom: 5px;" class="btn btn-sm btn-danger btn-xs"><i class="fa fa-close"></i></a> <a style="width: 300px;" class="thumbnail"><img style="width: 300px; height: 200px;" src="../../Content/Resources/Products/Small/' + smallImage + '" /></a>') : null;

        largeImages.ForEach(function (largeImage) {
            $('#lrgImgs').append('<a onclick="DeleteLargeImage(\'' + largeImage + '\')" style="margin-bottom: 5px;" class="btn btn-sm btn-danger btn-xs"><i class="fa fa-close"></i></a> <a style="width: 450px;" class="thumbnail"><img style="width: 450px; height: 300px;" src="../../Content/Resources/Products/Large/' + largeImage + '" /></a>');
        });
    } else {
        $('#smlImg').empty();
        $('#lrgImgs').empty();
    }
}

function DeleteSmallImage() {
    $.ajax({
        type: "POST",
        url: "/MegaMarket/Admin/Office/DeleteSmallImage",
        data: { productId: selectedProduct.id },
        success: function (data) {
            InitProductsGrid(selectedTreeNode.id);
            $('#addEditProductForm').hide();
            
            selectedProduct = null;
            productImages = [];
            smallImage = null;
        }
    });
}

function DeleteLargeImage(largeImageName) {
    $.ajax({
        type: "POST",
        url: "/MegaMarket/Admin/Office/DeleteLargeImage",
        data: { largeImageName: largeImageName, productId: selectedProduct.id },
        success: function (data) {
            InitProductsGrid(selectedTreeNode.id);
            $('#addEditProductForm').hide();
            
            selectedProduct = null;
            productImages = [];
            smallImage = null;
        }
    });
}
