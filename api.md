# まず必要なエンドポイント
 - root_path:  index.html
 - assets -> frontendからの参照のみ
 - あとはNotFoundで404.htmlを返すくらいか


    ## 必要なAPIサイドのエンドポイント
    ```mediawiki=
      - api/
      |--- products/
        |--- :id/
           |-- like (post)
           |-- unlike (post)
           |-- vote (post)
    ```


# 一覧画面API

```javascript
// `api/products`
// Arrayで欲しい。一覧画面に表示するための一覧リスト
// ファッションとビューティの出し分けは手元で出し分けようと検討してます。
// 後々は最初は10件だけ取得。スクロールと同時に後半の取得などもして見たいなと。

[
    {
        type: string,
        image_url: string,
        owner: {
            name: string,
            subject: string,
            profile_photo_path: string,
        },
        likes: integer
    },
    {
        type: 'fashion',
        image_url: '1_Br2A_SHIOYA_Konatsu.jpg',
        owner: {
                name: '山下 美月',
                subject: 'ブライダル科 ３年',
                image_url: 'yamashitamizuki_prof',
        },
        likes: 100,
    },
    {
        type: 'beauty',
        image_url: '2_Br2A_TATEHASHI_Yui.jpg',
        owner: {
                name: '西野 七瀬',
                subject: 'ビューティ科 １年',
                image_url: 'nishinonanase_prof'
            },
        likes: 120,
    },
    {
        type: 'fashion',
        image_url: '2_Br2A_TATEHASHI_Yui.jpg',
        owner:　{
                name: '鈴木綾音',
                subject: 'ファッション科 １年',
                image_url: 'suzukiayane_prof'
        },
        likes: 3,
    }
]
```

# 詳細画面

```javascript
// api/products/:id
//  詳細ページに遷移した時にgetします。
//  その名の通りそのプロダクトの詳細情報が欲しいです。
//  sub_image_urls, memberはnullの可能性もあります。

{
    id: integer,
    concept: string,
    image_url: string,
    sub_image_urls: [
        string, string, string,
    ],
    owner: {
        name: string,
        subject: string,
        image_url: string,
        message: string,
    },
    member: [
        {
            name: string,
            subject: string,
            image_url: string,
            message: string,
        },
        {
            name: string,
            subject: string,
            image_url: string,
            message: string,
        },
    ],
    likes: integer,
}

--------------------------------------------------

// 以下に例を何パターンか出します。それぞれのJson id で判断してください
// sub_image_urls, menberに関してはどちらもnullの可能性があります。
// 0 以上 n以下の関係です。それぞれに上限数は設けるつもりですが現状未定です。
{
    id: 1,
    concept: 'AIが人間を制したら。',
    image_url: '1_Br2A_SHIOYA_Konatsu.jpg',
    owner: {
        name: '西野 七瀬',
        subject: 'ビューティ科 １年',
        image_url: 'nishinonanase_prof',
        message: 'hogehoge'
    },
    likes: 123,
}

---

{
    id: 2,
    concept: 'そのプロダクトに本当に価値があるのか。',
    image_url: '1_Br2A_SHIOYA_Konatsu.jpg',
    sub_image_urls: [
        'osushi_oisikatta.jpg',
        'omohide.jpg',
    ],
    owner: {
        name: '西野 七瀬',
        subject: 'ビューティ科 １年',
        image_url: 'nishinonanase_prof',
        message: 'hogehoge'
    },
    likes: 12,
}

---

{
    id: 3,
    concept: 'いいタイトルが思いつかないけどこの思い伝われ',
    image_url: '1_Br2A_SHIOYA_Konatsu.jpg',
    owner: {
        name: '西野 七瀬',
        subject: 'ビューティ科 １年',
        image_url: 'nishinonanase_prof',
        message: 'hogehoge'
    },
    member: [
        {
            name: '鈴木綾音',
            subject: 'ファッション科 １年',
            image_url: 'suzukiayane_prof',
            message: 'hogehoge'
        },
        {
            name: '生駒里奈',
            subject: 'ビューティ科 １年',
            image_url: 'ikomarina_prof',
            message: 'hogehoge'
        },
    ],
    likes: 49,
}

---

{
    id: 4,
    concept: '本当に大切なこと',
    image_url: '1_Br2A_SHIOYA_Konatsu.jpg',
    sub_image_urls: [
        'eigo_muzukasii.jpg',
        'hogehoge.jpg',
    ],
    owner: {
        name: '西野 七瀬',
        subject: 'ビューティ科 １年',
        image_url: 'nishinonanase_prof',
        message: 'hogehoge'
    },
    member: [
        {
            name: '鈴木綾音',
            subject: 'ファッション科 １年',
            image_url: 'suzukiayane_prof',
            message: 'hogehoge'
        },
        {
            name: '生駒里奈',
            subject: 'ビューティ科 １年',
            image_url: 'ikomarina_prof',
            message: 'hogehoge'
        },
    ],
    likes: 55,
}
```

# 自身が投票したやつの一覧

```javascript=
//   GET
//  '/products?id=3&2&5'
//  みたいなかんじでidを送りつけたら
//  一覧APIの形式で絞り込み条件にwhere(id = 3&2&5)みたいな感じで
//  クエリパラメータの値が欲しい
```


-----------------------------

# いいねをする

```javascript=
// POST： /products/:id/like
// '/:id'に該当するプロダクトに対して'Like'するとき
// TODO ボケてるので明日書く

client から
- POST
- '/products/:id/like'

返却値は該当のプロダクトの詳細ページと同じJSON
もしくはいいねの数を↓のように

{
    product_id: integer,
    likes: integer
}
```

# いいねを取り消す

```javascript=


- POST 
- '/products/:id/like', { delete: 1 }
  // リクエストボディにdeleteフラグで判断する
　　//  もしくはリクエストURLを '/unlike'にするか迷ってますが、↓の投票と同一の方がわかりやすそうなのでDeleteフラグで管理したい

返却値は該当のプロダクトの詳細ページと同じJSON
もしくはいいねの数を↓のように

{
    product_id: integer,
    likes: integer
}

```

# 投票する

```javascript=
- POST
- `products/:id/vote`

// productに対して投票する。


```

# 投票を取り消す


```javascript=
 - POST
 - `products/:id/vote`, { delete: 1 }
// なんか投票の否定英語わからん


// 返却値は
// Likeなどと同様に更新後のProductのデータ

```
