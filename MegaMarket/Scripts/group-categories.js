var groupCategory = null;
var groupCategories = null;
var params = null;
var selectedTreeNode = null;
var groupCategoryParams = null;
var selectedParam = null;
var selectedGroupParam = null;

function InitParamsGrid() {   
    // prepare the data
    var source =
    {
        datatype: "json",
        datafields: [
            { name: 'id', type: 'int' },
            { name: 'name', type: 'string' }
        ],
        url: "/MegaMarket/Admin/Office/GetProductParamTypes"
    };
    var dataAdapter = new $.jqx.dataAdapter(source, {
        downloadComplete: function (data, status, xhr) { },
        loadComplete: function (data) { },
        loadError: function (xhr, status, error) { }
    });

    groupCategoryParams = dataAdapter;

    // initialize jqxGrid
    $("#grdParams").jqxGrid(
    {
        width: '110%',
        height: 400,
        source: dataAdapter,
        columns: [
          { text: 'პარამეტრები', datafield: 'name' }          
        ]
    });
}

function GetGroupCategories() {   
    $.ajax({
        type: "GET",
        url: "/MegaMarket/Admin/Office/GetGroupCategories",
        success: function (data) {
            $('#groupCategoryName').val('');
            $('#addEditGroupCategory').hide();

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
                        { name: 'icon' },
                        { name: 'iconImage' }
                    ],
                    id: 'id',
                    localdata: data
                };

            var dataAdapter = new $.jqx.dataAdapter(source);
            dataAdapter.dataBind();

            var records = dataAdapter.getRecordsHierarchy('id', 'parentId', 'items', [{ name: 'name', map: 'label' }]);

            $('#jqxTree').jqxTree({
                source: records, height: '600px', width: '350px', toggleMode: 'dblclick', dragEnd: function (dragItem, dropItem, args, dropPosition, tree) {
                    DragDropGroupCategory(dragItem, dropItem);
                }, dragStart: function (item) {
                    if (item.id == 1)
                        return false;
                }
            });
            $('#jqxTree').css('visibility', 'visible');
            var contextMenu = $("#jqxMenu").jqxMenu({ width: '150px', autoOpenPopup: false, mode: 'popup' });
            var clickedItem = null;

            $('#jqxTree').on('select', function (event) {
                var selectedItem = $('#jqxTree').jqxTree('selectedItem');
                if (selectedItem != null && selectedItem.id != 1) {
                    $('#addEditGroupCategoryTitle').text('კატეგორიის რედაქტირება');
                    $('#groupCategoryName').val(selectedItem.label);
                    $('#addEditGroupCategory').show();
                    $('#groupCategoryName').focus();
                    groupCategory = selectedItem;
                    attachContextMenu();
                }

                $('#paramsTreeAndGrid').show();

                InitParamsGrid();

                selectedTreeNode = selectedItem;
                InitGroupParamsGrid();
            });

            var attachContextMenu = function () {
                $("#jqxTree li").on('mousedown', function (event) {
                    var target = $(event.target).parents('li:first')[0];
                    var rightClick = isRightClick(event);
                    if (rightClick && target != null) {
                        $("#jqxTree").jqxTree('selectItem', target);
                        var scrollTop = $(window).scrollTop();
                        var scrollLeft = $(window).scrollLeft();
                        contextMenu.jqxMenu('open', parseInt(event.clientX) + 5 + scrollLeft, parseInt(event.clientY) + 5 + scrollTop);
                        return false;
                    }
                });
            }

            attachContextMenu();
            $("#jqxMenu").on('itemclick', function (event) {
                var item = $.trim($(event.args).text());
                switch (item) {
                    case "დამატება":
                        var selectedItem = $('#jqxTree').jqxTree('selectedItem');
                        if (selectedItem != null) {
                            $('#addEditGroupCategoryTitle').text('კატეგორიის დამატება');
                            $('#groupCategoryName').val('');
                            $('#addEditGroupCategory').show();
                            $('#groupCategoryName').focus();
                            groupCategory = selectedItem;
                            groupCategory.newObj = true; //for add
                            attachContextMenu();

                            $('#paramsTreeAndGrid').hide();
                        }
                        break;
                    case "წაშლა":
                        var selectedItem = $('#jqxTree').jqxTree('selectedItem');
                        if (selectedItem != null && selectedItem.id != 1 && !selectedItem.hasItems) {
                            groupCategory = selectedItem;
                            SaveGroupCategory(true);
                            attachContextMenu();
                        }
                        break;
                }
            });

            $(document).on('contextmenu', function (e) {
                if ($(e.target).parents('.jqx-tree').length > 0) {
                    return false;
                }
                return true;
            });
            function isRightClick(event) {
                var rightclick;
                if (!event) var event = window.event;
                if (event.which) rightclick = (event.which == 3);
                else if (event.button) rightclick = (event.button == 2);
                return rightclick;
            }

            groupCategories = data;

            $('#btnUp').show();
            $('#btnDown').show();
        }
    });
}

function InitGroupParamsGrid() {
    // prepare the data
    var source =
    {
        datatype: "json",
        datafields: [
            { name: 'id', type: 'int' },
            { name: 'name', type: 'string' }
        ],
        url: "/MegaMarket/Admin/Office/GetProductParamTypes/" + selectedTreeNode.id
    };
    var dataAdapter = new $.jqx.dataAdapter(source, {
        downloadComplete: function (data, status, xhr) { },
        loadComplete: function (data) { },
        loadError: function (xhr, status, error) { }
    });

    groupCategoryParams = dataAdapter;

    // initialize jqxGrid
    $("#grdGroupParams").jqxGrid(
    {
        width: '110%',
        height: 400,
        source: dataAdapter,
        columns: [
          { text: 'კატეგორიის პარამეტრები', datafield: 'name' }
        ]
    });    
}

$(document).ready(function () {
    $.jqx.theme = 'bootstrap';
    GetGroupCategories();

    $("#uploadIcon").css('color', 'transparent');

    $.ajax({
        type: "GET",
        url: "/MegaMarket/Admin/Office/GetProductParamTypes",
        success: function (data) {
            if (data) {
                params = data;
                InitParamsGrid();
            }
        }
    });


    $("#uploadIcon").on('change', function () {
        $("#uploadIcon").css('color', '#333');
    });


    $('#grdParams').on('rowselect', function (event) {
        selectedParam = event.args.row;
    });

    $('#grdGroupParams').on('rowselect', function (event) {
        selectedGroupParam = event.args.row;
    });
});

function SaveGroupParam(groupParamModel) {
    $.ajax({
        type: "POST",
        url: "/MegaMarket/Admin/Office/SaveGroupParam",
        data: groupParamModel,
        success: function (data) {
            if (data) {
                InitGroupParamsGrid();
            }
        }
    });    
}

function CancelSaveGroupCategory() {
    return $('#addEditGroupCategory').hide();
}

function SaveGroupCategory(toDelete) {
    if (!IsUndefinedNullOrEmpty($('#groupCategoryName').val())) {       
        var data = new FormData();
        var files = $("#uploadIcon").get(0).files;
        if (files.length > 0) {
            data.append("GroupCategoryIcon", files[0]);

            $.ajax({
                url: "/MegaMarket/Admin/Office/UploadGroupCategoryIcon",
                type: "POST",
                processData: false,
                contentType: false,
                data: data,
                success: function (response) {
                    var model = {
                        id: groupCategory.newObj ? 0 : groupCategory.id,
                        name: $('#groupCategoryName').val(),
                        orderBy: groupCategory.newObj ? (groupCategories.Where('parentId == ' + groupCategory.id) == null ? 1 : groupCategories.Where('parentId == ' + groupCategory.id).Max('orderBy') + 1) : groupCategories.First('id == ' + groupCategory.id).orderBy,
                        parentId: groupCategory.newObj ? groupCategory.id : groupCategory.parentId,
                        mainGroupId: null, //TODO change
                        path: 'path', //TODO change
                        deleted: toDelete,
                        iconName: response
                    }

                    $.ajax({
                        type: "POST",
                        url: "/MegaMarket/Admin/Office/SaveGroupCategory",
                        data: model,
                        success: function (data) {
                            if (data) {
                                $("#uploadIcon").css('color', 'transparent');
                                GetGroupCategories();
                            }
                        }
                    });
                }
            });
        } else {
            var model = {
                id: groupCategory.newObj ? 0 : groupCategory.id,
                name: $('#groupCategoryName').val(),
                orderBy: groupCategory.newObj ? (groupCategories.Where('parentId == ' + groupCategory.id) == null ? 1 : groupCategories.Where('parentId == ' + groupCategory.id).Max('orderBy') + 1) : groupCategories.First('id == ' + groupCategory.id).orderBy,
                parentId: groupCategory.newObj ? groupCategory.id : groupCategory.parentId,
                mainGroupId: null, //TODO change
                path: 'path', //TODO change
                deleted: toDelete,
                iconName: groupCategories.First('id == ' + selectedTreeNode.id).iconImage
            }

            $.ajax({
                type: "POST",
                url: "/MegaMarket/Admin/Office/SaveGroupCategory",
                data: model,
                success: function (data) {
                    if (data) {
                        $("#uploadIcon").css('color', 'transparent');
                        GetGroupCategories();
                    }
                }
            });
        }
    } else {
        $('#groupCategoryName').css('border-color', '#FF0000');
    }
}

function DragDropGroupCategory(dragItem, dropItem) {
    if (dragItem.id != dropItem.id) {
        var model = {
            id: dragItem.id,
            name: dragItem.label,
            orderBy: groupCategories.Where('parentId == ' + dropItem.id) == null ? 1 : groupCategories.Where('parentId == ' + dropItem.id).Max('orderBy') + 1,
            parentId: dropItem.id,
            mainGroupId: groupCategories.First('id == ' + dragItem.id).mainGroupId,
            path: groupCategories.First('id == ' + dragItem.id).path,
            deleted: false,
            iconName: groupCategories.First('id == ' + selectedTreeNode.id).iconImage
        }

        $.ajax({
            type: "POST",
            url: "/MegaMarket/Admin/Office/SaveGroupCategory",
            data: model,
            success: function (data) {
                if (data) {
                    GetGroupCategories();
                }
            }
        });
    }
}

function UpGroupCategory() {
    var selectedItem = $('#jqxTree').jqxTree('selectedItem');

    if (selectedItem != null) {
        var selItem = groupCategories.First('id == ' + selectedItem.id);
        var prevItem = groupCategories.Where('parentId == ' + selItem.parentId).Last('orderBy < ' + selItem.orderBy);

        selItem.iconName = groupCategories.First('id == ' + selItem.id).iconImage
        prevItem.iconName = groupCategories.First('id == ' + prevItem.id).iconImage

        if (prevItem != null) {
            var x = selItem.orderBy;
            selItem.orderBy = prevItem.orderBy;
            prevItem.orderBy = x;

            $.ajax({
                type: "POST",
                url: "/MegaMarket/Admin/Office/DragDropGroupCategories",
                data: { selItem: selItem, prevOrNextItem: prevItem },
                success: function (data) {
                    if (data) {
                        GetGroupCategories();
                    }
                }
            });
        }
    }
}

function DownGroupCategory() {
    var selectedItem = $('#jqxTree').jqxTree('selectedItem');

    if (selectedItem != null) {
        var selItem = groupCategories.First('id == ' + selectedItem.id);
        var nextItem = groupCategories.Where('parentId == ' + selItem.parentId).First('orderBy > ' + selItem.orderBy);

        selItem.iconName = groupCategories.First('id == ' + selItem.id).iconImage
        nextItem.iconName = groupCategories.First('id == ' + nextItem.id).iconImage

        if (nextItem != null) {
            var x = selItem.orderBy;
            selItem.orderBy = nextItem.orderBy;
            nextItem.orderBy = x;

            $.ajax({
                type: "POST",
                url: "/MegaMarket/Admin/Office/DragDropGroupCategories",
                data: { selItem: selItem, prevOrNextItem: nextItem },
                success: function (data) {
                    if (data) {
                        GetGroupCategories();
                    }
                }
            });
        }
    }
}

function LinkParam() {
    if (!IsUndefinedNullOrEmpty(selectedParam)) {
        var groupParamModel = {
            id: 0,
            groupCategoryId: selectedTreeNode.id,
            productParamTypeId: selectedParam.id,
            deleted: false
        }

        SaveGroupParam(groupParamModel);
    }
}

function DeleteGroupParam() {
    if (!IsUndefinedNullOrEmpty(selectedGroupParam)) {
        var groupParamModel = {
            id: 0,
            groupCategoryId: selectedTreeNode.id,
            productParamTypeId: selectedGroupParam.id,
            deleted: true
        }

        SaveGroupParam(groupParamModel);
    }
}
