# RESTful API Documentation for Billy

## Users

| Action                      | Path               | HTTP Method |
| --------------------------- | ------------------ | ----------- |
| [List users](#List-users)   | /users/            | GET         |
| [Get user](#Get-user)       | /users/{username}/ | GET         |
| [Create user](#Create-user) | /users/            | POST        |
| [Edit user](#Edit-user)     | /users/{user_id}/  | PUT         |
| [Delete user](#Delete-user) | /users/{user_id}/  | DELETE      |

<br/>

## Expenses

| Action                                              | Path                                   | HTTP Method |
| --------------------------------------------------- | -------------------------------------- | ----------- |
| [List expenses](#List-expenses)                     | /expenses/                             | GET         |
| [Get expense](#Get-expense)                         | /expenses/{expense_id}/                | GET         |
| [Create expense](#Create-expense)                   | /expenses/                             | POST        |
| [Edit expense](#Edit-expense)                       | /expenses/{expense_id}/                | PUT         |
| [Delete expense](#Delete-expense)                   | /expenses/{expense_id}/                | DELETE      |
| [List expense categories](#List-expense-categories) | /expenses/categories/                  | GET         |
| [List user expenses](#List-user-expenses)           | /users/{username}/expenses/            | GET         |
| [List user categories](#List-user-categories)       | /users/{username}/expenses/categories/ | GET         |

<br/><br/>

### List users

List all users registered to the system.

```
GET /users/
```

| Parameter   | Type    | In    | Description                                          |
| ----------- | ------- | ----- | ---------------------------------------------------- |
| `type`      | string  | query | `user`, `admin`, or `owner`                          |
| `sort`      | string  | query | `username`, `age`, `first_name`, `last_name`, `type` |
| `direction` | string  | query | `asc` or `dsc`                                       |
| `per_page`  | integer | query | Number of users to fetch (max 100)                   |
| `page`      | integer | query | Page number of the results to fetch                  |

---

### Get user

Gets information about a user.

```
GET /users/{username}/
```

| Parameter  | Type   | In   | Description         |
| ---------- | ------ | ---- | ------------------- |
| `username` | string | path | Username of account |

---

### Create user

Registers a user to the system.

```
POST /users/
```

| Parameter  | Type   | In   | Description                                   |
| ---------- | ------ | ---- | --------------------------------------------- |
| `username` | string | body | Username for new user, must not already exist |
| `password` | string | body | Password for new user                         |
| `name`     | JSON   | body | JSON Object with `first` and `last` keys      |

---

### Edit user

Update the details for a user.

```
PUT /users/{user_id}/
```

| Parameter  | Type   | In   | Description                                                 |
| ---------- | ------ | ---- | ----------------------------------------------------------- |
| `user_id`  | string | path |                                                             |
| `username` | string | body | New username for user, must not already exist               |
| `password` | string | body | New password for new user                                   |
| `name`     | JSON   | body | JSON object including new `first` value and/or `last` value |

---

### Delete user

Deletes a user from the system. This is a soft delete i.e. the account will only be flagged as disabled.

```
DELETE /users/{user_id}/
```

| Parameter | Type     | In   | Description |
| --------- | -------- | ---- | ----------- |
| `user_id` | ObjectID | path |             |

---

### List expenses

Lists all expenses entered into the system.

```
GET /expenses/
```

| Parameter    | Type    | In    | Description                                                                                                    |
| ------------ | ------- | ----- | -------------------------------------------------------------------------------------------------------------- |
| `search`     | stromg  | query | Search keywords to match expense titles                                                                        |
| `sort`       | string  | query | `title`, `date`, `user_id`, `category`, or `amount`                                                            |
| `direction`  | string  | query | `asc` or `dsc`                                                                                                 |
| `start_date` | string  | query | Start date of the expenses to fetch. If left empty, will retrieve expenses starting from the beginning of time |
| `end_date`   | string  | query | End date of the expenses to fetch. If left empty, will retrieve expenses up until the current time             |
| `per_page`   | integer | query | Number of expenses to fetch (max 100)                                                                          |
| `page`       | integer | query | Page number of the results to fetch                                                                            |

---

### Get expense

Retrieves the details for a certain expense.

```
GET /expenses/{expense_id}/
```

| Parameter    | Type     | In   | Description                 |
| ------------ | -------- | ---- | --------------------------- |
| `expense_id` | ObjectID | path | MongoDB ObjectID of expense |

---

### Create expense

Adds an expense item to the database.

```
POST /expenses/
```

| Parameter  | Type     | In   | Description                                        |
| ---------- | -------- | ---- | -------------------------------------------------- |
| `user_id`  | ObjectID | body | MongoDB ObjectID of the user that owns the expense |
| `title`    | string   | body | Name of the expense                                |
| `amount`   | float    | body | Price of the expense                               |
| `date`     | date     | body | Date of the expense                                |
| `category` | string   | body | Category of the expense                            |

---

### Edit expense

Modifies an existing expense in the database.

```
PUT /expenses/{expense_id}/
```

| Parameter    | Type     | In   | Description                 |
| ------------ | -------- | ---- | --------------------------- |
| `expense_id` | ObjectID | path | MongoDB ObjectID of expense |
| `title`      | string   | body | Name of the expense         |
| `amount`     | float    | body | Price of the expense        |
| `date`       | date     | body | Date of the expense         |
| `category`   | string   | body | Category of the expense     |

---

### Delete expense

Removes an expense from the database. This operation is a hard delete i.e. this cannot be undone.

```
DELETE /expenses/{expense_id}/
```

| Parameter    | Type     | In   | Description                 |
| ------------ | -------- | ---- | --------------------------- |
| `expense_id` | ObjectID | path | MongoDB ObjectID of expense |

---

### List expense categories

Lists all the categories of expenses across users.

```
GET /expenses/categories/
```

---

### List user expenses

Lists all expenses of a single user.

```
GET /users/{username}/expenses/
```

| Parameter    | Type    | In    | Description                                                                                                    |
| ------------ | ------- | ----- | -------------------------------------------------------------------------------------------------------------- |
| `username`   | string  | path  |                                                                                                                |
| `search`     | stromg  | query | Search keywords to match expense titles                                                                        |
| `sort`       | string  | query | `name`, `date`, `user`, `category`, or `amount`                                                                |
| `direction`  | string  | query | `asc` or `dsc`                                                                                                 |
| `start_date` | string  | query | Start date of the expenses to fetch. If left empty, will retrieve expenses starting from the beginning of time |
| `end_date`   | string  | query | End date of the expenses to fetch. If left empty, will retrieve expenses up until the current time             |
| `per_page`   | integer | query | Number of expenses to fetch (max 100)                                                                          |
| `page`       | integer | query | Page number of the results to fetch                                                                            |

---

### List user categories

Lists the categories of the expenses of a single user.

```
GET /users/{username}/expenses/categories/
```

| Parameter  | Type   | In   | Description |
| ---------- | ------ | ---- | ----------- |
| `username` | string | path |             |
