$(document).ready(function () {
    const API_ENDPOINT = "https://api.github.com";
    const TOKEN = GITHUB_TOKEN_HERE
  
    const createContributorsApi = (repo) =>
      `${API_ENDPOINT}/repos/${repo}/contributors?q=contributions&order=desc`;
  
    const createReposApi = () =>
      `${API_ENDPOINT}/search/repositories?q=stars:150000..300000`;
  
    const createIssuesApi = (repo, state) =>
      `${API_ENDPOINT}/search/issues?q=state:${state}+repo:${repo}+type:issue`;
  
    const createCommentsApi = (repo, issue = 19046) =>
      `${API_ENDPOINT}/repos/${repo}/issues/${issue}/comments`;
  
    async function transport(url, params = {}) {
      const options = {
        method: params.method || "GET",
        headers: {
          Authorization: `Token ${TOKEN}`,
          Accept: "application/vnd.github.cloak-preview",
        },
      };
  
      if (params.body) {
        options.body = params.body;
      }
  
      let response;
      try {
        response = await fetch(url, options);
      } catch (error) {
        console.error(error);
        throw new Error(error, "Error fetching data");
      }
  
      if (response.ok) {
        try {
          return response.json();
        } catch (error) {
          console.error(error);
          throw new Error(error, "Error parsing JSON data");
        }
      }
    }
  
    async function buscarRepositorios() {
      const data = await transport(createReposApi());
      $(".repo-list").html(
        data.items.map(
          (i) =>
            `<li class="nav-item nav-link border rounded mb-1">
                <a class="nav-item nav-link repo-link" data-repo-name=${i.full_name}>
                    ${i.name}
                </a>
            </li>
            `
        )
      );
    }
  
    buscarRepositorios();
  
    $(".repo-list").on("click", "a.repo-link", function (e) {
      let repo = $(this).attr("data-repo-name");
      buscarContribuidores(repo);
      buscarIssues(repo, "open");
      $(".hide").fadeIn("slow");
      $(this).parent().addClass('active').siblings().removeClass('active');
    });
  
    $(".issues-list").on("click", "a.issue-link", function (e) {
      $(".issue-hide").fadeIn("slow");
    });
  
    async function buscarIssues(repo, state) {
      console.log(repo, state);
      const data = await transport(createIssuesApi(repo, state));
      console.log(data);
  
      $(".issues-list").html(
        data.items.map(
          (i) =>
            `
      <li class="nav-item border rounded mb-1">
          <a class="nav-link issue-link" data-issue-number=${i.number}>
              ${i.title}
          </a>
          <div class="nav-link">
              ${i.body}
          </div>
      </li>
      `
        )
      );
  
      $("body").on("click", ".issue-link", async function (e) {
        let issueNumber = $(this).attr("data-issue-number");
        await buscarComentarios(repo, issueNumber);
        $(this).toggleClass("active");
      });
    }
  
    async function buscarContribuidores(repo) {
      const data = await transport(createContributorsApi(repo));
  
      const finalData = {
        [`100-200`]: [],
        [`200-500`]: [],
        [`500+`]: [],
      };
      data.forEach((dataPoint) => {
        if (dataPoint.contributions > 100 && dataPoint.contributions < 200) {
          finalData["100-200"].push(dataPoint);
        } else if (
          dataPoint.contributions >= 200 &&
          dataPoint.contributions < 500
        ) {
          finalData["200-500"].push(dataPoint);
        } else if (dataPoint.contributions > 500) {
          finalData["500+"].push(dataPoint);
        }
      });
  
      let statusHTML = "";
      Object.entries(finalData).forEach(([key, values]) => {
        statusHTML += `
          <div class="col-sm">
              <div>${key}</div>
              ${values.map(
                (value) =>
                  `<li class="nav-item border rounded mb-1">
                      <a class="nav-link">${value.login}</a>
                  </li>
                  `
              )}
          </div>
          `;
      });
  
      $(".constributors-list").html(`
          ${statusHTML} 
          <div class="container row issues">
            <h1>Issues</h1>
            <div>
            <button value="${repo}" id="open" class="btn btn-success">
                Open
            </button>
            <button value="${repo}" id="closed" class="btn btn-danger">
                Closed
            </button>
            </div>
          </div>
  `);
      $("#open").click(async (event) => {
        await buscarIssues(event.target.value, "open");
      });
      $("#closed").click(async (event) => {
        await buscarIssues(event.target.value, "closed");
      });
    }
  
    async function buscarComentarios(repo) {
      const data = await transport(createCommentsApi(repo, 19046));
      $(".comments-list").html(
        data.map(
          (i) =>
            `<div class="nav-item nav-link border rounded mb-1">
          ${i.body}
          </div>
        `
        )
      );
    }
});