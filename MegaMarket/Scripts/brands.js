var brand = {
    id: 0,
    name: '',
    deleted: false
}

function AddBrand() {
    $('#addEditBrandTitle').text('ბრენდის დამატება');
    $('#brandName').val('');
    $('#addEditBrand').show();
    $('#brandName').focus();

    brand.id = 0;
}

function EditBrand(brandId, brandName) {
    $('#addEditBrandTitle').text('ბრენდის რედაქტირება');
    $('#brandName').val(brandName);
    $('#brandName').focus();
    $('#addEditBrand').show();

    brand.id = brandId;
}

function CancelSaveBrand() {
    $('#addEditBrand').hide();

    brand.id = 0;
    brand.name = '';
}

function DeleteBrand(brandId) {
    brand.id = brandId;
    brand.deleted = true;

    SaveBrand(true);
}


function SaveBrand(deleted) {
    if (!IsUndefinedNullOrEmpty($('#brandName').val()) || deleted) {
        brand.name = $('#brandName').val();

        $.ajax({
            type: "POST",
            url: "/MegaMarket/Admin/Office/SaveBrand",
            data: brand,
            success: function (data) {
                if (data) {
                    window.location.reload();
                }
            }
        });
    }else{
        $('#brandName').css('border-color', '#FF0000');
    }    
}