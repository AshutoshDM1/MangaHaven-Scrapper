    // Set authentication token in localStorage
    // console.log("Setting authentication token in localStorage...");
    // await page.evaluate(() => {
    //   localStorage.setItem(
    //     "oidc.user:https://auth.mangadex.org/realms/mangadex:mangadex-frontend-stable",
    //     JSON.stringify({
    //       id_token:
    //         "eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICJHSHg0Qmk2THhvdVRGLWZuQmg0WXhMbUtUbGZzT2tmTm9fQ05yT1pMZHNrIn0.eyJleHAiOjE3NDY5ODY5OTksImlhdCI6MTc0Njk4NjA5OSwiYXV0aF90aW1lIjoxNzQ2OTg2MDQ3LCJqdGkiOiJjNGFmYjk3OS02MjdiLTRmMWMtODE4Ny0zZjk0M2RmYzNmZDUiLCJpc3MiOiJodHRwczovL2F1dGgubWFuZ2FkZXgub3JnL3JlYWxtcy9tYW5nYWRleCIsImF1ZCI6Im1hbmdhZGV4LWZyb250ZW5kLXN0YWJsZSIsInN1YiI6ImIyODMzMmFiLWFmNzctNDdlNy04OTc2LTFlZGUyNmE1ODMwMCIsInR5cCI6IklEIiwiYXpwIjoibWFuZ2FkZXgtZnJvbnRlbmQtc3RhYmxlIiwic2Vzc2lvbl9zdGF0ZSI6IjM2ZTJkMDVlLWY4NWUtNDVjMy1hZWIwLTljNjJlOTAwNTYxMCIsImF0X2hhc2giOiJZMF81dHNkbmVtRFZMbWRyU2JBY3BRIiwic2lkIjoiMzZlMmQwNWUtZjg1ZS00NWMzLWFlYjAtOWM2MmU5MDA1NjEwIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsInJvbGVzIjpbIlJPTEVfVVNFUiIsIm9mZmxpbmVfYWNjZXNzIiwidW1hX2F1dGhvcml6YXRpb24iLCJkZWZhdWx0LXJvbGVzLW1hbmdhZGV4Il0sImdyb3VwcyI6WyJHUk9VUF9VU0VSIl0sInByZWZlcnJlZF91c2VybmFtZSI6ImRvd25sb2RlbWFzdGVyMSIsImVtYWlsIjoiZG93bmxvZGVtYXN0ZXIxQGdtYWlsLmNvbSJ9.BEyH39_V16V-mQHOMauha5Pw3uLYfJd2aacfWn_LG3y3qRPVGhpmj7z9UYBg-5scOTzyK2S5CgEBPboGlQjtGFEEIPLwqEgnPK9aOjE_v2_6Q3AhXFkOleAF3LrhkBSKfZA5euqW_S18UrrwfNEv2v9OtyHZn97NkokxKG_Sy3o0MyjrTmnJxR42Oxk6JnwSIos1dAMpfuFN-aNUpUDqlTGYH05BHEi2z1DPIICKXeBaX7vr5cICdvzHfL-V7_i4ifQ9RsASVuYfIYq0E0rl1E8GKZzomjnT8to3317BKUr-wrM3IWb-xI-qwBgDWUZ_dc--axO-_gzg01e6F1GBpQ",
    //       session_state: "36e2d05e-f85e-45c3-aeb0-9c62e9005610",
    //       access_token:
    //         "eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICJHSHg0Qmk2THhvdVRGLWZuQmg0WXhMbUtUbGZzT2tmTm9fQ05yT1pMZHNrIn0.eyJleHAiOjE3NDY5ODY5OTksImlhdCI6MTc0Njk4NjA5OSwiYXV0aF90aW1lIjoxNzQ2OTg2MDQ3LCJqdGkiOiI0NzU3ZGM2ZC0yNWEwLTQzMWQtOTNiYy0xNTJhMzg5NGEwMjkiLCJpc3MiOiJodHRwczovL2F1dGgubWFuZ2FkZXgub3JnL3JlYWxtcy9tYW5nYWRleCIsImF1ZCI6ImFjY291bnQiLCJzdWIiOiJiMjgzMzJhYi1hZjc3LTQ3ZTctODk3Ni0xZWRlMjZhNTgzMDAiLCJ0eXAiOiJCZWFyZXIiLCJhenAiOiJtYW5nYWRleC1mcm9udGVuZC1zdGFibGUiLCJzZXNzaW9uX3N0YXRlIjoiMzZlMmQwNWUtZjg1ZS00NWMzLWFlYjAtOWM2MmU5MDA1NjEwIiwicmVzb3VyY2VfYWNjZXNzIjp7ImFjY291bnQiOnsicm9sZXMiOlsibWFuYWdlLWFjY291bnQiLCJtYW5hZ2UtYWNjb3VudC1saW5rcyIsInZpZXctcHJvZmlsZSJdfX0sInNjb3BlIjoib3BlbmlkIGdyb3VwcyBlbWFpbCBwcm9maWxlIiwic2lkIjoiMzZlMmQwNWUtZjg1ZS00NWMzLWFlYjAtOWM2MmU5MDA1NjEwIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsInJvbGVzIjpbIlJPTEVfVVNFUiIsIm9mZmxpbmVfYWNjZXNzIiwidW1hX2F1dGhvcml6YXRpb24iLCJkZWZhdWx0LXJvbGVzLW1hbmdhZGV4Il0sImdyb3VwcyI6WyJHUk9VUF9VU0VSIl0sInByZWZlcnJlZF91c2VybmFtZSI6ImRvd25sb2RlbWFzdGVyMSIsImVtYWlsIjoiZG93bmxvZGVtYXN0ZXIxQGdtYWlsLmNvbSJ9.yDhas1a3RJX61IOxdrHRvlWrMsQuck8KZjPOcrSRHif_9e05LLScd-_vDwDk4y6etNyR6EJ1IWsHXe-gsiJ9203lHwSjPQpGxqA2Z5tgIX_h5LpPSrwX5QgNjZ-b0UH0vs5ZuhLnf9oY-k89bMZ0-3JA6bBeC7YNEjupESShrMZ-0njosrVCzpTetXzy_aFaFULYsFrmwQFqBxftcIc6IN4KM_18AWDIr0cMxzpKjQazwjtE34p1fT9Rr7sXgwre6ccM9rduS0raRE6Sg015WwJn8RNrzOktJ0MjK7ZOPzbuXnFcynoXUiAau7Nr6E4fBB_B6BBl9c-9yAU-IcS3Fg",
    //       refresh_token:
    //         "eyJhbGciOiJIUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICI5NTIxYTI5NC01YTRmLTQwNTgtYTdhNC1jZjI2YzU2NDhkMzIifQ.eyJleHAiOjE3NTQ3NjIwNDcsImlhdCI6MTc0Njk4NjA5OSwianRpIjoiMTVlYzBlODAtOTcwZS00OTBjLWIyNjYtZjk4ZmE4YWYzMjIwIiwiaXNzIjoiaHR0cHM6Ly9hdXRoLm1hbmdhZGV4Lm9yZy9yZWFsbXMvbWFuZ2FkZXgiLCJhdWQiOiJodHRwczovL2F1dGgubWFuZ2FkZXgub3JnL3JlYWxtcy9tYW5nYWRleCIsInN1YiI6ImIyODMzMmFiLWFmNzctNDdlNy04OTc2LTFlZGUyNmE1ODMwMCIsInR5cCI6IlJlZnJlc2giLCJhenAiOiJtYW5nYWRleC1mcm9udGVuZC1zdGFibGUiLCJzZXNzaW9uX3N0YXRlIjoiMzZlMmQwNWUtZjg1ZS00NWMzLWFlYjAtOWM2MmU5MDA1NjEwIiwic2NvcGUiOiJvcGVuaWQgZ3JvdXBzIGVtYWlsIHByb2ZpbGUiLCJzaWQiOiIzNmUyZDA1ZS1mODVlLTQ1YzMtYWViMC05YzYyZTkwMDU2MTAifQ.Hoxa4QuAiQSrwbZmLZi3u-XQMXFeG9SDLGM2m6pui1A",
    //       token_type: "Bearer",
    //       scope: "openid groups email profile",
    //       profile: {
    //         exp: 1746986999,
    //         iat: 1746986099,
    //         iss: "https://auth.mangadex.org/realms/mangadex",
    //         aud: "mangadex-frontend-stable",
    //         sub: "b28332ab-af77-47e7-8976-1ede26a58300",
    //         typ: "ID",
    //         session_state: "36e2d05e-f85e-45c3-aeb0-9c62e9005610",
    //         sid: "36e2d05e-f85e-45c3-aeb0-9c62e9005610",
    //         email_verified: true,
    //         roles: [
    //           "ROLE_USER",
    //           "offline_access",
    //           "uma_authorization",
    //           "default-roles-mangadex",
    //         ],
    //         groups: ["GROUP_USER"],
    //         preferred_username: "downlodemaster1",
    //         email: "downlodemaster1@gmail.com",
    //       },
    //       expires_at: 1746986999,
    //     })
    //   );
    //   console.log("Authentication token set successfully");
    // });

    // // Reload the page to apply authentication
    // console.log("Reloading page to apply authentication...");
    // await page.reload({ waitUntil: "networkidle2" });
    // await new Promise((resolve) => setTimeout(resolve, 2000));