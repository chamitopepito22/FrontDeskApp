


const baseAPI = "https://chum.hatawna.com";
let facilityData;
let customerData;


function addStorage(CustomerId, FacilityId) {
    $("#addStorage").fadeIn();
    $("#mainForm").hide();
    $("#addEditFacility").hide();
    $("#addEditCustomer").hide();
    $("#addStorage_customer").focus();
    resetFields();

    if (CustomerId == -1 && FacilityId == -1)
        refreshDrowDowns();

    else {
        $("#addStorage_customer").val(CustomerId);
        $("#addStorage_facility").val(FacilityId);
    }
    
}


function retrievePackage(CustomerId, FacilityId) {
    $("#addStorage").hide();
    $("#mainForm").hide();
    $("#addEditFacility").hide();
    $("#addEditCustomer").hide();
    $("#retrieveStorage").fadeIn();

    $("#retrieveStorage_customer").focus();
    resetFields();

    $("#retrieveStorage_customer").val(CustomerId);
    $("#retrieveStorage_facility").val(FacilityId);

    loadRetrieveStoragelist();
}


$(document).ready(function () {
    loadAllCustomers();
    loadAllFacilities();
    refreshDrowDowns();
    $("#btnAddCustomer").on('click', function (e) {
        $("#mainForm").hide();
        $("#mainForm").hide();
        $("#addEditCustomer").fadeIn();
        $("#customer_firstname").focus();
        resetFields();
    });



    $("#btnAddFacilty").on('click', function (e) {
        $("#mainForm").hide();
        $("#addEditFacility").fadeIn();
        $("#addEditCustomer").hide();
        $("#facility_name").focus();
        resetFields();
    });

    $("#btnStorePackage").on('click', function (e) {
        addStorage(-1, -1);      
    });

    

    $("#btnRetrievePackage").on('click', function (e) {
        //$("#mainForm").hide();
        //$("#retrieveStorage").fadeIn();
        //$("#addEditFacility").height();
        //$("#addEditCustomer").hide();
        //$("#retrieveStorage_column_customer_name").focus();
        
        //resetFields();
        

        retrievePackage(-1, -1)
       
    });

    $(".retrieveStorage_search_dropdown").on("change", function (e) {
        loadRetrieveStoragelist();
    });



    $('.btnCancel').on('click', function (e) {
        refreshContent();
    });


    $("#form_customer").on('submit', function (e) {
        $("#form_customer").addClass('disabledfrm');
        ShowToast('info', 'Saving customer info...');

        
        let customerId = -1;
        try {
            customerId = parseInt($("#customer_id").attr('data-id'));
        } catch (e) {

        }

        var formdata = new FormData();
        if(customerId != -1)
            formdata.append("CustomerId", customerId);

        formdata.append("FirstName", $("#customer_firstname").val());
        formdata.append("LastName", $("#customer_lastname").val());
        formdata.append("PhoneNumber", $("#customer_phonenumber").val());


        $.ajax({
            type: "POST",
            url: baseAPI + "/Customers/Add",
            async: false,
            data: JSON.stringify({
                FirstName: $("#customer_firstname").val()
                , LastName: $("#customer_lastname").val()
                , PhoneNumber: $("#customer_phonenumber").val()
            }),
            contentType: "application/json",
            success: function (data) {
                if (data) {
                    reloadContent();
                    ShowToast('success', 'Customer info saved.');
                    refreshDrowDowns();
                }
                else
                    ShowToast('error', "Error: Something went wrong. We will make sure to look this one. Our apologies.");
                
            },
            complete: function (data) {
                $("#form_customer").removeClass('disabledfrm');
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                ShowToast('error', "Error: Something went wrong. We will make sure to look this one. Our apologies.");
                
            }
        });

        return false;
    });

    $("#form_facility").on('submit', function (e) {
        $("#form_facility").addClass('disabledfrm');
        ShowToast('info', 'Saving customer info...');


        let facility_id = -1;
        try {
            facility_id = parseInt($("#facility_id").attr('data-id'));
        } catch (e) {

        }
        console.log(JSON.stringify({
            Name: $("#facility_name").val()
            , SmallMaxCount: $("#facility_smallmaxcount").val()
            , MediumMaxCount: $("#facility_mediummaxcount").val()
            , LargeMaxCount: $("#facility_largemaxcount").val()
        }));

        $.ajax({
            type: "POST",
            url: baseAPI + "/Facilities/Add",
            async: false,
            data: JSON.stringify({
                Name: $("#facility_name").val()
                , SmallMaxCount: parseInt($("#facility_smallmaxcount").val())
                , MediumMaxCount: parseInt($("#facility_mediummaxcount").val())
                , LargeMaxCount: parseInt($("#facility_largemaxcount").val())
            }),
            contentType: "application/json",
            success: function (data) {
                console.log('data', data);
                if (data) {
                    reloadContent();
                    ShowToast('success', 'Facility info saved.');
                    refreshDrowDowns();
                }
                else
                    ShowToast('error', "Error: Something went wrong. We will make sure to look this one. Our apologies.");
            },
            complete: function (data) {
                $("#form_facility").removeClass('disabledfrm');
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                console.log(XMLHttpRequest);
                console.log(textStatus);
                console.log(errorThrown);
                ShowToast('error', "Error: Something went wrong. We will make sure to look this one. Our apologies.");

            }
        });

        return false;
    });




    $("#form_retrieveStorage").on('submit', function (e) {
        loadRetrieveStoragelist();
        return false;
    });

    $("#form_addStorage").on('submit', function (e) {

        if ($("#addStorage_customer").val() == "-1") {
            ShowToast('error', 'Please select a Customer.');
            $("#addStorage_customer").focus();
            return false;
        }
        else if ($("#addStorage_facility").val() == "-1") {
            ShowToast('error', 'Please select a Facility.');
            $("#addStorage_facility").focus();
            return false;
        }


        $("#form_addStorage").addClass('disabledfrm');
        ShowToast('info', 'Trying to store your pacakage...');



        $.ajax({
            type: "POST",
            url: baseAPI + "/CustomerBoxes/Add",
            async: false,
            data: JSON.stringify({
                customerId: parseInt($("#addStorage_customer").val())
                , facilityId: parseInt($("#addStorage_facility").val())
                , boxType: parseInt($("#addStorage_boxtype").val())
                , notes: $("#addStorage_notes").val()
            }),
            contentType: "application/json",
            success: function (data) {
                console.log('data', data);
                if (data) {
                    reloadContent();
                    ShowToast('success', 'Package stored.');
                }
                else {

                    for (i = 0; i < facilityData.length; i++) {

                        if (parseInt($("#addStorage_facility option:selected").val()) == facilityData[i]['id']) {
                            let name = facilityData[i]['name'];
                            ShowToast('warning', "Sorry: There is not enough room in the '" + $("#addStorage_boxtype option:selected").text() + "' section of '" + name + "' facility '");
                        }
                    }


                }

            },
            complete: function (data) {
                $("#form_addStorage").removeClass('disabledfrm');
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                console.log(XMLHttpRequest);
                console.log(textStatus);
                console.log(errorThrown);
                ShowToast('error', "Error: Something went wrong. We will make sure to look this one. Our apologies.");

            }
        });

        return false;
    });
    


});


function refreshDrowDowns() {
    $('#addStorage_customer').empty();
    $('#addStorage_facility').empty();

    $('#retrieveStorage_customer').empty();
    $('#retrieveStorage_facility').empty();

    let url = baseAPI + "/Customers/GetAll";
    let headers = {}




    fetch(url, {
        method: "GET",
        mode: 'cors',
        headers: headers
    })
        .then((response) => {
            if (!response.ok) {
                throw new Error(response.error)
            }
            return response.json();
        })
        .then(data => {
            customerData = data;
            console.log(data);
            $('#addStorage_customer').append($('<option>', {
                value: -1,
                text: '--'
            }));

            $('#retrieveStorage_customer').append($('<option>', {
                value: -1,
                text: '--'
            }));


            for (i = 0; i < data.length; i++) {
                console.log(data[i]['totalBoxes']);


                $('#addStorage_customer').append($('<option>', {
                    value: data[i]['id'],
                    text: '#' + data[i]['id'] + ' - ' + data[i]['firstName'] + ' ' + data[i]['lastName'] + '(Boxes = ' + data[i]['totalBoxes'] + ')'
                }));




                $('#retrieveStorage_customer').append($('<option>', {
                    value: data[i]['id'],
                    text: '#' + data[i]['id'] + ' - ' + data[i]['firstName'] + ' ' + data[i]['lastName'] + '(Boxes = ' + data[i]['totalBoxes'] + ')'
                }));

            }



        })
        .catch(function (error) {
            console.log(error);
        });


    url = baseAPI + "/Facilities/GetAll";

    fetch(url, {
        method: "GET",
        mode: 'cors',
        headers: headers
    })
        .then((response) => {
            if (!response.ok) {
                throw new Error(response.error)
            }
            return response.json();
        })
        .then(data => {
            facilityData = data;
            $('#addStorage_facility').append($('<option >', {
                value: -1,
                text: '--'
            }));


            $('#retrieveStorage_facility').append($('<option >', {
                value: -1,
                text: '--'
            }));

            for (i = 0; i < data.length; i++) {
              

                $('#addStorage_facility').append($('<option >', {
                    value: data[i]['id'],
                    /*text: '#' + data[i]['id'] + ' - ' + data[i]['name'] + ' (S ' + data[i]['smallCount'] + '/' + data[i]['smallMaxCount'] + ', M ' + data[i]['mediumCount'] + '/' + data[i]['mediumMaxCount'] + ', L ' + data[i]['largeCount'] + '/' + data[i]['largeMaxCount'] + ')'*/
                    text: '#' + data[i]['id'] + ' - ' + data[i]['name']
                }));

                $('#retrieveStorage_facility').append($('<option >', {
                    value: data[i]['id'],
                    text: '#' + data[i]['id'] + ' - ' + data[i]['name'] + ' (S ' + data[i]['smallCount'] + '/' + data[i]['smallMaxCount'] + ', M ' + data[i]['mediumCount'] + '/' + data[i]['mediumMaxCount'] + ', L ' + data[i]['largeCount'] + '/' + data[i]['largeMaxCount'] + ')'
                    //text: '#' + data[i]['id'] + ' - ' + data[i]['name']
                }));



            }



        })
        .catch(function (error) {
            console.log(error);
        });



}
function ShowToast(icon, title) {
    const Toast = Swal.mixin({
        toast: true,
        position: 'bottom-left',
        showConfirmButton: false,
        timer: 5000,
        timerProgressBar: true,
        didOpen: (toast) => {
            toast.addEventListener('mouseenter', Swal.stopTimer)
            toast.addEventListener('mouseleave', Swal.resumeTimer)
        }
    })

    Toast.fire({
        icon: icon,
        title: title
    })
}

function reloadContent() {
    loadAllCustomers();
    loadAllFacilities();
    refreshContent();
}

function refreshContent() {
    $("#mainForm").fadeIn();
    $("#addEditFacility").hide();
    $("#addEditCustomer").hide();
    $("#addStorage").hide();
    $("#retrieveStorage").hide();

    resetFields();
    
}
function resetFields() {
    $("#customer_firstname").val('');
    $("#customer_lastname").val('');
    $("#customer_phonenumber").val('');
    $("#facility_name").val('');
    $("#addStorage_notes").val('');
}



function loadAllFacilities() {
    $("#facilities > tbody > tr").remove();
    

    let url = baseAPI + "/Facilities/GetAll";
    var headers = {}
    let totalSmallBoxes = 0;
    let totalSmallMaxBoxes = 0;
    let totalMediumBoxes = 0;
    let totalMediumMaxBoxes = 0;
    let totalLargeBoxes = 0;
    let totalLargeMaxBoxes = 0;
    console.log(url);

    fetch(url, {
        method: "GET",
        mode: 'cors',
        headers: headers
    })
        .then((response) => {
            if (!response.ok) {
                throw new Error(response.error)
            }
            return response.json();
        })
        .then(data => {
            //console.log(data);
            for (i = 0; i < data.length; i++) {
                //console.log(data[i]);

                $("#facilities").find('tbody')
                    .append('<tr class="facility_row" data-facility-id="' + data[i]['id'] +  '">'
                    + '<td>'
                    + '<button type="button" class="btn btn-danger ml-2 facility_delete" data-id=""><svg xmlns="http://www.w3.org/2000/svg" class="" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"></path><line x1="3" y1="3" x2="21" y2="21"></line><path d="M4 7h3m4 0h9"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="14" x2="14" y2="17"></line><path d="M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2 -2l.077 -.923"></path><line x1="18.384" y1="14.373" x2="19" y2="7"></line><path d="M9 5v-1a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v3"></path></svg></button>'
                    + '<button type="button" class="btn btn-success ml-2 facility_addStorage facility_addStorage" title="Add Package" data-facility-id="' + data[i]['id'] +  '" ><svg xmlns="http://www.w3.org/2000/svg" class="" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"></path><path d="M15 12h3.586a1 1 0 0 1 .707 1.707l-6.586 6.586a1 1 0 0 1 -1.414 0l-6.586 -6.586a1 1 0 0 1 .707 -1.707h3.586v-3h6v3z"></path><path d="M15 3h-6"></path><path d="M15 6h-6"></path></svg></button>'
                    + '<button type="button" class="btn btn-warning ml-2 facility_retrieveStorage facility_retrievePackage" title="Retrieve Package" data-facility-id="' + data[i]['id'] +  '"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"></path><path d="M9 12h-3.586a1 1 0 0 1 -.707 -1.707l6.586 -6.586a1 1 0 0 1 1.414 0l6.586 6.586a1 1 0 0 1 -.707 1.707h-3.586v3h-6v-3z"></path><path d="M9 21h6"></path><path d="M9 18h6"></path></svg></button>'
                    + '</td>'
                    + ' <td>' + data[i]['name'] + '</td><td>'
                    + data[i]['smallCount'] + '/' + data[i]['smallMaxCount'] + '</td><td>'
                    + data[i]['mediumCount'] + '/' + data[i]['mediumMaxCount'] + '</td><td>'
                    + data[i]['largeCount'] + '/' + data[i]['largeMaxCount']
                        + '</td></tr>');

                totalSmallBoxes += parseInt(data[i]['smallCount']);
                totalSmallMaxBoxes += parseInt(data[i]['smallMaxCount']);
                totalMediumBoxes += parseInt(data[i]['mediumCount']);
                totalMediumMaxBoxes += parseInt(data[i]['mediumMaxCount']);
                totalLargeBoxes += parseInt(data[i]['largeCount']);
                totalLargeMaxBoxes += parseInt(data[i]['largeMaxCount']);
            }

            $("#facilities").find('tbody')
                .append('<tr><td></td><td><h3> Total </h3></td><td><h3>'
                + totalSmallBoxes + '/' + totalSmallMaxBoxes + '</h3></td><td><h3>'
                + totalMediumBoxes + '/' + totalMediumMaxBoxes + '</h3></td><td><h3>'
                + totalLargeBoxes + '/' + totalLargeMaxBoxes    
                    + '</h3></td></tr>');


            $(".facility_addStorage").on('click', function (e) {
                let FacilityId = $(this).attr('data-facility-id');
                addStorage(-1, FacilityId);
            });

            $(".facility_retrievePackage").on('click', function (e) {
                let FacilityId = $(this).attr('data-facility-id');
                retrievePackage(-1, FacilityId);
            });

            var facility_rows = $(".facility_row");

            $(facility_rows).each(function () {
                var facility_row = this;
                let FacilityId = $(facility_row).attr('data-facility-id');

                var delete_buttons = $(facility_row).find(".facility_delete");
                $(delete_buttons).on('click', function (e) {



                    Swal.fire({
                        title: 'Are you sure?',
                        text: "Confirm delete Facility personal information? ",
                        icon: 'warning',
                        showCancelButton: true,
                        confirmButtonColor: '#3085d6',
                        cancelButtonColor: '#d33',
                        confirmButtonText: 'Yes'
                    }).then((result) => {
                        if (result.isConfirmed) {

                            $(facility_row).addClass('disabledfrm');
                            ShowToast('warning', 'Deleting Facility info...');


                            $.ajax({
                                type: "POST",
                                url: baseAPI + "/Facilities/Delete",
                                async: false,
                                data: JSON.stringify({
                                    Id: parseInt(FacilityId)

                                }),
                                contentType: "application/json",
                                success: function (data) {
                                    if (data == "success") {
                                        ShowToast('success', 'Facility info deleted.');
                                        $(facility_row).fadeOut("slow", function () {
                                            $(facility_row).remove();
                                        });
                                    }
                                    else
                                        ShowToast('error', data);
                                },
                                complete: function (data) {
                                    $(facility_row).removeClass('disabledfrm');
                                },
                                error: function (XMLHttpRequest, textStatus, errorThrown) {
                                    console.log(XMLHttpRequest);
                                    console.log(textStatus);
                                    console.log(errorThrown);
                                    ShowToast('error', "Error: Something went wrong. We will make sure to look this one. Our apologies.");

                                }
                            });


                        }
                    });


                });


            });



        })
        .catch(function (error) {
            console.log(error);
        });
}

function loadAllCustomers() {
    $("#customers > tbody > tr").remove();
    let url = baseAPI + "/Customers/GetAll";
    let headers = {}
    let totalBoxes = 0;
    //console.log(url);

    fetch(url, {
        method: "GET",
        mode: 'cors',

        headers: headers
    })
        .then((response) => {
            if (!response.ok) {
                throw new Error(response.error)
            }
            return response.json();
        })
        .then(data => {
            //console.log(data);
            for (i = 0; i < data.length; i++) {
                console.log(data[i]['totalBoxes'] );

                $("#customers").find('tbody')
                    .append('<tr class="customer_row" data-customer-id="' + data[i]['id'] +  '">'
                        + '<td>'
                    + '<button type="button" class="btn btn-danger btn-xs ml-2 customer_delete"  data-id=""><svg xmlns="http://www.w3.org/2000/svg" class="" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"></path><line x1="3" y1="3" x2="21" y2="21"></line><path d="M4 7h3m4 0h9"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="14" x2="14" y2="17"></line><path d="M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2 -2l.077 -.923"></path><line x1="18.384" y1="14.373" x2="19" y2="7"></line><path d="M9 5v-1a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v3"></path></svg></button>'
                    + '<button type="button" class="btn btn-success btn-xs ml-2 customer_addStorage customer_addStorage" title="Add Package" data-customer-id="' + data[i]['id'] +  '"><svg xmlns="http://www.w3.org/2000/svg" class="" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"></path><path d="M15 12h3.586a1 1 0 0 1 .707 1.707l-6.586 6.586a1 1 0 0 1 -1.414 0l-6.586 -6.586a1 1 0 0 1 .707 -1.707h3.586v-3h6v3z"></path><path d="M15 3h-6"></path><path d="M15 6h-6"></path></svg></button>'
                    + '<button type="button" class="btn btn-warning btn-xs ml-2 customer_retrievePackage" title="Retrieve Package" data-customer-id="' + data[i]['id'] +  '"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"></path><path d="M9 12h-3.586a1 1 0 0 1 -.707 -1.707l6.586 -6.586a1 1 0 0 1 1.414 0l6.586 6.586a1 1 0 0 1 -.707 1.707h-3.586v3h-6v-3z"></path><path d="M9 21h6"></path><path d="M9 18h6"></path></svg></button>'
                    + '</td><td>' + data[i]['firstName'] + ' ' + data[i]['lastName'] + '</td><td>'
                        + data[i]['phoneNumber'] + '</td><td>'
                        + data[i]['totalBoxes'] + '</td></tr>');

                totalBoxes += parseInt(data[i]['totalBoxes']);
            }
           
            $("#customers").find('tbody')
                .append('<tr><td></td><td></td><td></td><td><h3> Total - ' + totalBoxes + '</h3></td></tr>');

            setTimeout(function () {

                $(".customer_addStorage").on('click', function (e) {
                    let CustomerId = $(this).attr('data-customer-id');
                    addStorage(CustomerId, -1);
                });

                $(".customer_retrievePackage").on('click', function (e) {
                    let CustomerId = $(this).attr('data-customer-id');
                    retrievePackage(CustomerId, -1);
                });

                var customer_rows = $(".customer_row");

                $(customer_rows).each(function () {
                    var customer_row = this;
                    let CustomerId = $(customer_row).attr('data-customer-id');

                    var delete_buttons = $(customer_row).find(".customer_delete");
                    $(delete_buttons).on('click', function (e) {

                        

                        Swal.fire({
                            title: 'Are you sure?',
                            text: "Confirm delete customer personal information? " ,
                            icon: 'warning',
                            showCancelButton: true,
                            confirmButtonColor: '#3085d6',
                            cancelButtonColor: '#d33',
                            confirmButtonText: 'Yes'
                        }).then((result) => {
                            if (result.isConfirmed) {

                                $(customer_row).addClass('disabledfrm');
                                ShowToast('warning', 'Deleting customer info...');


                                $.ajax({
                                    type: "POST",
                                    url: baseAPI + "/Customers/DeleteInfo",
                                    async: false,
                                    data: JSON.stringify({
                                        Id: parseInt(CustomerId)

                                    }),
                                    contentType: "application/json",
                                    success: function (data) {
                                        if (data) {
                                            ShowToast('success', 'Customer info deleted.');
                                            $(customer_row).fadeOut("slow", function () {
                                                $(customer_row).remove();
                                            });
                                        }
                                        else
                                            ShowToast('error', "Unable to delete customer info.");
                                    },
                                        complete: function (data) {
                                        $(customer_row).removeClass('disabledfrm');
                                    },
                                    error: function (XMLHttpRequest, textStatus, errorThrown) {
                                        console.log(XMLHttpRequest);
                                        console.log(textStatus);
                                        console.log(errorThrown);
                                        ShowToast('error', "Error: Something went wrong. We will make sure to look this one. Our apologies.");

                                    }
                                });



                                //$.ajax({
                                //    type: "POST",
                                //    url: baseAPI + "/Customers/DeleteInfo",
                                //    async: false,
                                //    data: JSON.stringify({
                                //        Id: CustomerId
                                        
                                //    }),
                                //    contentType: "application/json",
                                //    success: function (data) {
                                //        if (data) {
                                //            ShowToast('success', 'Customer info deleted.');
                                //            $(customer_row).fadeOut("slow", function () {
                                //                $(customer_row).remove();
                                //            });
                                //        }
                                //        else
                                //            ShowToast('error', "Unable to delete customer info.");

                                //    },
                                //    complete: function (data) {
                                //        $(customer_row).removeClass('disabledfrm');
                                //    },
                                //    error: function (XMLHttpRequest, textStatus, errorThrown) {
                                //        console.log(XMLHttpRequest);
                                //        console.log(textStatus);
                                //        console.log(errorThrown);
                                //        ShowToast('error', "Error: Something went wrong. We will make sure to look this one. Our apologies.");

                                //    }
                                //});

                            }
                        });


                    });


                });
                

            }, 1500);


           

        })
        .catch(function (error) {
            console.log(error);
        });
}
function loadRetrieveStoragelist() {
    $("#retrieveStorage_list > tbody > tr").remove();
    let url = baseAPI + "/CustomerBoxes/GetCustomerBoxesDetails?"
        + "CustomerId=" + $("#retrieveStorage_customer").val()
        + "&FacilityId=" + $("#retrieveStorage_facility").val()
        + "&BoxType=" + $("#retrieveStorage_boxtype").val()
        + "&Notes=" + $("#retrieveStorage_notes").val();
    let headers = {}
    let totalBoxes = 0;
    console.log(url);

    fetch(url, {
        method: "GET",
        mode: 'cors',
        headers: headers
    })
        .then((response) => {
            if (!response.ok) {
                throw new Error(response.error)
            }
            return response.json();
        })
        .then(data => {
            console.log(data);
            for (i = 0; i < data.length; i++) {

                let BoxType = data[i]['boxType'];

                if (BoxType == 1)
                    BoxType = "Small";
                else if (BoxType == 2)
                    BoxType = "Medium";
                else if (BoxType == 3)
                    BoxType = "Large";

                let newRow = '<tr><td class="customerBoxes_row" data-id="' + data[i]['id'] + '" data-customer-id="' + data[i]['customerId'] + '" data-facility-id="' + data[i]['facilityId'] + '" data-box-type="' + data[i]['boxType'] +  '">';

                if (data[i]['storageStatus'] == 1)
                    newRow += '<button type="button" class="btn btn-warning btn-xs ml-2 retrieveStorage_Button " title="Retrieve Package" data-id=""><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"></path><path d="M9 12h-3.586a1 1 0 0 1 -.707 -1.707l6.586 -6.586a1 1 0 0 1 1.414 0l6.586 6.586a1 1 0 0 1 -.707 1.707h-3.586v3h-6v-3z"></path><path d="M9 21h6"></path><path d="M9 18h6"></path></svg></button>';
                else
                    newRow += 'Retrieved';

                newRow += '</td><td>' + data[i]['customerFirstName'] + ' ' + data[i]['customerLastName'] + ' - ' + data[i]['customerPhoneNumber'] + '</td><td>'
                    + data[i]['facilityName'] + '</td><td>'
                    + BoxType + '</td><td>'
                    + data[i]['notes'] + '</td><td>'
                    + data[i]['createdDate'] + '</td></tr>';

                $("#retrieveStorage_list").find('tbody')
                    .append(newRow);

                totalBoxes += parseInt(data[i]['totalBoxes']);
            }


            var customerBoxes_rows = $(".customerBoxes_row");

            $(customerBoxes_rows).each(function () {
                var customerBoxes_row = this;
                let Id = $(customerBoxes_row).attr('data-id');
                let CustomerId = $(customerBoxes_row).attr('data-customer-id');
                let FacilityId = $(customerBoxes_row).attr('data-facility-id');
                let BoxType = $(customerBoxes_row).attr('data-box-type');

                var retrieveStorage_Button = $(customerBoxes_row).find(".retrieveStorage_Button");
                $(retrieveStorage_Button).on('click', function (e) {
                    ShowToast('info', 'Retrieving package.....');
                    $.ajax({
                        type: "POST",
                        url: baseAPI + "/CustomerBoxes/Retrieve",
                        async: false,
                        data: JSON.stringify({
                            Id: parseInt(Id)
                            , CustomerId: parseInt(CustomerId)
                            , FacilityId: parseInt(FacilityId)
                            , BoxType: parseInt(BoxType)

                        }),
                        contentType: "application/json",
                        success: function (data) {
                            if (data) {
                                ShowToast('success', 'Package retrieved.');
                                $(customerBoxes_row).html('Retrieved');
                                reloadContent();
                            }
                            else
                                ShowToast('error', "Unable to delete customer info.");
                        },
                        complete: function (data) {
                            $(customerBoxes_row).removeClass('disabledfrm');
                        },
                        error: function (XMLHttpRequest, textStatus, errorThrown) {
                            console.log(XMLHttpRequest);
                            console.log(textStatus);
                            console.log(errorThrown);
                            ShowToast('error', "Error: Something went wrong. We will make sure to look this one. Our apologies.");

                        }
                    });



                });


            });




        })
        .catch(function (error) {
            console.log(error);
        });
}
