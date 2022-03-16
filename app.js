var dataSet = {};
var dt;

$(document).ready(function () {
  var page = 1;
  var order = "asc";
  var limit = 100;
  var sort = "CustomerID";
  var searchKeyword = "";
  var queryUrl =
    "http://localhost:3000/contacts?_page=" +
    page +
    "&_limit=" +
    limit +
    "&_sort=" +
    sort +
    "&_order=" +
    order +
    "&q=" +
    searchKeyword;
  var reloadOnce = false;
  var counts = {};

  // Setup - add a text input to each footer cell
  $("#myTable thead tr")
    .clone(true)
    .addClass("filters")
    .appendTo("#myTable thead");

  dt = $("#myTable")
    .DataTable({
      data: dataSet,
      columns: [
        { data: "CustomerID" },
        { data: "CustomerName" },
        { data: "Age" },
        { data: "Qualification" },
        { data: "Income" },
        { data: "WorkExp" },
        { data: "NumofHousehold" },
        { data: "Region" },
        { data: "State" },
        { data: "AccountBalance" },
        { data: "RelationShipTenure" },
        { data: "NumberofAccounts" },
        { data: "TypeofAccount" },
        { data: "EmploymentStatus" },
      ],
      lengthChange: false,
      lengthMenu: [10],
      dom: "Qlfrtip",
      orderCellsTop: true,
      fixedHeader: true,
      searchBuilder: {
        columns: [2, 9, 4, 7, 8, 12],
        logic: "OR",
        logic: "AND",
      },
      initComplete: function () {
        var api = this.api();

        // For each column
        api
          .columns()
          .eq(0)
          .each(function (colIdx) {
            // Set the header cell to contain the input element
            var cell = $(".filters th").eq(
              $(api.column(colIdx).header()).index()
            );
            var title = $(cell).text();
            $(cell).html('<input type="text" placeholder="' + title + '" />');

            // On every keypress in this input
            $(
              "input",
              $(".filters th").eq($(api.column(colIdx).header()).index())
            )
              .off("keyup change")
              .on("keyup change", function (e) {
                e.stopPropagation();

                // Get the search value
                $(this).attr("title", $(this).val());
                var regexr = "({search})"; //$(this).parents('th').find('select').val();

                var cursorPosition = this.selectionStart;
                console.log(this.value);
                // Search the column for that value
                api
                  .column(colIdx)
                  .search(
                    this.value != ""
                      ? regexr.replace("{search}", "(((" + this.value + ")))")
                      : "",
                    this.value != "",
                    this.value == ""
                  )
                  .draw();

                $(this)
                  .focus()[0]
                  .setSelectionRange(cursorPosition, cursorPosition);
              });
          });
      },
    })
    .on("order.dt", function () {
      if (event && event.target && event.target.innerHTML) {
        sort = event.target.innerHTML;
        if (event.target.classList && event.target.classList.length > 1) {
          order = event.target.classList[1].split("_")[1];
          //reloadOnce = true;
        }
      }
      queryUrl = buildQueryString();
      console.log(reloadOnce);
      if (reloadOnce) {
        console.log(queryUrl);
        updateTableData();
      }
    })
    .on("search.dt", function () {
    })
    .on("page.dt", function () {
      if (event && event.target && event.target.innerHTML) {
        page = event.target.innerHTML;
        var info = dt.page.info();
        if (info.page + 1 === info.pages) {
          getNextRecords();
        }
      }
    });
  function updateTableData() {
    fetch(queryUrl)
      .then((response) => response.json())
      .then((data) => {
        dataSet = data;
        dt.rows.add(dataSet).draw();
        reloadOnce = false;
      });
  }
  updateTableData();
  function buildQueryString() {
    queryUrl =
      "http://localhost:3000/contacts?_page=" +
      page +
      "&_limit=" +
      limit +
      "&_sort=" +
      sort +
      "&_order=" +
      order +
      "&q=" +
      searchKeyword;
    return queryUrl;
  }

  function getNextRecords() {
    queryUrl1 =
      "http://localhost:3000/contacts?_page=" +
      page +
      "&_limit=" +
      limit +
      "&_sort=" +
      sort +
      "&_order=" +
      order +
      "&q=" +
      searchKeyword;
    fetch(queryUrl1)
      .then((response) => response.json())
      .then((data) => {
        dataSet = data;
        console.log(dataSet);
        dt.rows.add(data).draw();

        dt.page(page - 1).draw(false);
      });
    reloadOnce = false;
  }
});
